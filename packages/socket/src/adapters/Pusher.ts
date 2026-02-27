import { EventEmitter } from '@folklore/events';
import type { Channel, default as Pusher } from 'pusher-js';

import { debug } from '../debug';
import { SocketAdapter, SocketAdapterEvents } from '../types';

class PusherSocket extends EventEmitter<SocketAdapterEvents> implements SocketAdapter {
    options: {
        uuid: string | null;
        publishKey: string | null;
        subscribeKey: string | null;
        secretKey: string | null;
        appKey: string | null;
        cluster: string | null;
        [key: string]: unknown;
    };
    destroyed: boolean;
    ready: boolean;
    shouldStart: boolean;
    started: boolean;
    starting: boolean;
    Pusher: typeof Pusher | null;
    pusher: Pusher | null;
    channels: string[];
    clients: Record<string, Channel>;

    constructor(opts) {
        super();
        this.options = {
            uuid: null,
            publishKey: null,
            subscribeKey: null,
            secretKey: null,
            ...opts,
        };

        this.onReady = this.onReady.bind(this);
        this.onConnected = this.onConnected.bind(this);
        this.onMessage = this.onMessage.bind(this);

        this.destroyed = false;
        this.ready = false;
        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        this.Pusher = null;
        this.pusher = null;
        this.channels = [];
        this.clients = {};

        this.init();
    }

    onReady() {
        if (this.destroyed) {
            return;
        }
        this.ready = true;
        this.emit('ready');
    }

    onConnected() {
        this.started = true;
        this.starting = false;
        this.emit('started');
    }

    onMessage(message) {
        this.emit('message', message);

        if (typeof message.event !== 'undefined') {
            this.emit(message.event, message.data || message);
        }
    }

    updateChannels(channels) {
        debug(`Updating channels: ${channels.join(', ')}`);

        const { shouldStart, started, starting } = this;
        if (started || starting) {
            this.stop();
        }

        this.channels = channels;

        if (started || starting || shouldStart) {
            this.shouldStart = false;
            this.start();
        }
    }

    init() {
        if (this.pusher !== null) {
            return;
        }
        debug('[Pusher] Init');

        this.destroyed = false;
        const loadPusher = this.Pusher !== null ? Promise.resolve() : this.loadPusher();
        loadPusher.then(() => this.createPusher()).then(() => this.onReady());
    }

    loadPusher() {
        debug('[Pusher] Load Pusher');
        return import('pusher-js').then(({ default: Pusher }) => {
            this.Pusher = Pusher;
        });
    }

    createPusher() {
        if (this.destroyed) {
            return;
        }

        debug('[Pusher] Create Pusher appKey: %s', this.options.appKey);

        const { Pusher } = this;

        const { appKey, ...options } = this.options;
        this.pusher = new Pusher(appKey, options);
    }

    destroy() {
        this.destroyed = true;

        this.stop();

        this.pusher = null;

        this.clients = {};

        this.ready = false;

        debug('[Pusher] Destroyed.');
    }

    start() {
        if (this.started) {
            debug('[Pusher] Skipping start: Already started.');
            return;
        }
        if (this.starting) {
            debug('[Pusher] Skipping start: Already starting.');
            return;
        }

        if (this.pusher === null) {
            debug('[Pusher] Socket.io not ready.');
            this.shouldStart = true;
            return;
        }

        if (this.channels.length === 0) {
            debug('[Pusher] Skipping start: No channels.');
            this.shouldStart = true;
            return;
        }

        this.shouldStart = false;
        this.starting = true;

        this.pusher.connection.bind('connected', this.onConnected);

        this.clients = this.channels.reduce(
            (map, channel) => ({
                ...map,
                [channel]: this.createClient(channel),
            }),
            {},
        );

        this.emit('start');
    }

    stop() {
        if (!this.started && !this.starting) {
            return;
        }
        debug('[Pusher] Stopping...');

        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        this.pusher.connection.unbind('connected');

        Object.keys(this.clients).forEach((channelName) =>
            this.stopClient(channelName, this.clients[channelName]),
        );
        this.clients = {};

        this.emit('stop');
    }

    createClient(channelName) {
        const channel = this.pusher.subscribe(channelName);
        channel.bind_global((event, data) => this.onMessage({ event, data, channel }));
        return channel;
    }

    stopClient(channelName, channel) {
        channel.unbind_global();
        this.pusher.unsubscribe(channelName);
        return channel;
    }

    send(data) {
        debug('[Pusher] Sending', data);
        return new Promise((resolve) => {
            const { channel, event = null, data: eventData } = data;
            this.pusher.send_event(event || 'message', eventData, channel);
            resolve(data);
        });
    }
}

export default PusherSocket;
