import { EventEmitter } from '@folklore/events';
import isArray from 'lodash-es/isArray';
import type { Manager, Socket } from 'socket.io-client';

import { debug } from '../debug';
import { SocketAdapter, SocketAdapterEvents } from '../types';

class SocketIOSocket extends EventEmitter<SocketAdapterEvents> implements SocketAdapter {
    options: {
        uuid: string | null;
        host: string | null;
        path: string | null;
        query: Record<string, unknown> | null;
        [key: string]: unknown;
    };
    Manager: typeof Manager | null;
    io: Manager | null;
    sockets: Record<string, Socket>;
    channels: string[];
    shouldStart: boolean;
    started: boolean;
    starting: boolean;
    ready: boolean;

    constructor(opts) {
        super();
        this.options = {
            uuid: null,
            host: 'http://127.0.0.1',
            path: null,
            query: null,
            ...opts,
        };

        this.onReady = this.onReady.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onMessage = this.onMessage.bind(this);

        this.ready = false;
        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        this.Manager = null;
        this.io = null;
        this.sockets = {};
        this.channels = [];

        this.init();
    }

    onReady() {
        this.ready = true;
        this.emit('ready');
    }

    onConnect(channel) {
        debug('[socket.io] Socket connected on %s', channel);

        if (!this.started) {
            this.started = true;
            this.starting = false;
            this.emit('started');
        }
    }

    onMessage(message, channel) {
        debug('[socket.io] Message received on %s %o', channel, message);

        this.emit('message', message);
    }

    init() {
        import('socket.io-client')
            .then(({ Manager }) => {
                this.Manager = Manager;
            })
            .then(() => this.createManager())
            .then(() => this.onReady())
            .then(() => {
                if (this.shouldStart) {
                    this.start();
                }
            });
    }

    createManager() {
        const { Manager } = this;
        const { host, ...opts } = this.options;

        this.io = new Manager(host, {
            autoConnect: false,
            ...opts,
        });
    }

    updateChannels(channels) {
        debug(`[socket.io] Updating channels: ${channels.join(', ')}`);

        const { shouldStart, started, starting } = this;
        if (started || starting) {
            this.stop();
        }

        this.channels = channels;

        if (started || starting || shouldStart) {
            this.start();
        }
    }

    start() {
        if (this.started) {
            debug('[socket.io] Skipping start: Already started.');
            return;
        }
        if (this.starting) {
            debug('[socket.io] Skipping start: Already starting.');
            return;
        }

        if (this.io === null) {
            debug('[socket.io] not ready.');
            this.shouldStart = true;
            return;
        }

        if (this.channels.length === 0) {
            debug('[socket.io] Skipping start: No channels.');
            this.shouldStart = true;
            return;
        }

        this.shouldStart = false;
        this.starting = true;

        this.sockets = this.channels.reduce(
            (map, channel) => ({
                ...map,
                [channel]: this.createSocket(channel),
            }),
            {},
        );

        this.emit('start');
    }

    stop() {
        if (!this.started && !this.starting) {
            return;
        }
        debug('[socket.io] Stopping...');

        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        Object.values(this.sockets).forEach((socket) => this.stopSocket(socket));

        this.emit('stop');
    }

    createSocket(channel) {
        const socket = this.io.socket(`/${channel.replace(/^\//, '')}`);
        socket.on('message', (message) => this.onMessage(message, channel));
        socket.on('connect', () => this.onConnect(channel));
        socket.open();
        return socket;
    }

    stopSocket(socket) {
        socket.off('connect');
        socket.off('message');
        socket.close();
        return socket;
    }

    destroy() {
        this.stop();
        this.sockets = {};
        if (this.io !== null) {
            this.io = null;
        }
    }

    send(data) {
        const { channel, message } = data;
        const channels = !isArray(channel) ? [channel] : channel;
        channels.forEach((ch) => {
            this.sockets[ch].send(message);
        });
        return Promise.resolve();
    }
}

export default SocketIOSocket;
