import { EventEmitter } from '@folklore/events';
import type { Listener, default as PubNub, PubNubConfiguration } from 'pubnub';

import { debug } from '../debug';
import { SocketAdapter, SocketAdapterEvents } from '../types';

interface PubNubConstructor {
    new (options: PubNubConfiguration): PubNub;
}

class PubNubSocket extends EventEmitter<SocketAdapterEvents> implements SocketAdapter {
    options: {
        uuid: string | null;
        publishKey: string | null;
        subscribeKey: string | null;
        secretKey: string | null;
        userId: string | null;
        withPresence: boolean;
        subscriptionOptions?: Record<string, unknown> | null;
        [key: string]: unknown;
    };
    destroyed: boolean;
    ready: boolean;
    shouldStart: boolean;
    started: boolean;
    starting: boolean;
    PubNub: PubNubConstructor | null;
    pubnub: PubNub | null;
    pubnubListener: Listener | null;
    channels: string[];

    constructor(opts) {
        super();
        this.options = {
            uuid: null,
            publishKey: null,
            subscribeKey: null,
            secretKey: null,
            userId: null,
            withPresence: false,
            ...opts,
        };

        this.onReady = this.onReady.bind(this);
        this.onStatus = this.onStatus.bind(this);
        this.onMessage = this.onMessage.bind(this);

        this.destroyed = false;
        this.ready = false;
        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        this.PubNub = null;
        this.pubnub = null;
        this.pubnubListener = null;
        this.channels = [];

        this.init();
    }

    onReady() {
        if (this.destroyed) {
            return;
        }
        this.ready = true;
        this.emit('ready');
    }

    onStatus(statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory' && !this.started) {
            this.started = true;
            this.starting = false;
            this.emit('started');
        }
    }

    onMessage({ message }) {
        this.emit('message', message);

        if (typeof message.event !== 'undefined') {
            this.emit(message.event, message.data || message);
        }
    }

    updateChannels(channels) {
        debug(`[PubNub] Updating channels: ${channels.join(', ')}`);

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
        if (this.pubnub !== null) {
            return;
        }
        debug('[PubNub] Init');

        this.destroyed = false;
        const loadPubnub = this.PubNub !== null ? Promise.resolve() : this.loadPubNub();
        loadPubnub.then(() => this.createPubNub()).then(() => this.onReady());
    }

    loadPubNub() {
        debug('[PubNub] Load library');
        return import('pubnub').then(({ default: PubNub }) => {
            this.PubNub = PubNub;
        });
    }

    createPubNub() {
        if (this.destroyed) {
            return;
        }

        debug('[PubNub] Create client');
        const { PubNub } = this;
        const pubnubOptions: PubNubConfiguration = {
            publishKey: this.options.publishKey,
            subscribeKey: this.options.subscribeKey,
            userId: `web-user-${Math.floor(Math.random() * 1000)}`,
        };
        if (this.options.uuid !== null) {
            pubnubOptions.uuid = this.options.uuid;
        }
        if (this.options.userId !== null) {
            pubnubOptions.userId = this.options.userId;
        }
        if (this.options.secretKey !== null) {
            pubnubOptions.secretKey = this.options.secretKey;
        }
        this.pubnub = new PubNub(pubnubOptions);

        this.pubnubListener = {
            status: this.onStatus,
            message: this.onMessage,
        };
        this.pubnub.addListener(this.pubnubListener);
    }

    destroy() {
        this.destroyed = true;

        this.stop();

        if (this.pubnubListener) {
            this.pubnub.removeListener(this.pubnubListener);
            this.pubnubListener = null;
        }

        this.pubnub = null;

        this.ready = false;

        debug('[PubNub] Destroyed.');
    }

    start() {
        if (this.started) {
            debug('[PubNub] Skipping start: Already started.');
            return;
        }
        if (this.starting) {
            debug('[PubNub] Skipping start: Already starting.');
            return;
        }

        if (this.channels.length === 0) {
            debug('[PubNub] Skipping start: No channels.');
            this.shouldStart = true;
            return;
        }

        const { subscriptionOptions, withPresence } = this.options;
        this.shouldStart = false;
        this.starting = true;
        this.pubnub.subscribe({
            channels: this.channels,
            ...(subscriptionOptions || {}),
            withPresence,
        });

        this.emit('start');
    }

    stop() {
        if (!this.started && !this.starting) {
            return;
        }
        debug('[PubNub] Stopping...');

        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        this.pubnub.unsubscribe({
            channels: this.channels,
        });

        this.emit('stop');
    }

    send(data) {
        debug('[PubNub] Sending', data);
        return new Promise((resolve, reject) => {
            this.pubnub.publish(data, (status, response) => {
                if (status.error) {
                    reject(
                        new Error(
                            `Error operation:${status.operation} status:${status.statusCode}`,
                        ),
                    );
                } else {
                    resolve({
                        status,
                        response,
                        data,
                    });
                }
            });
        });
    }
}

export default PubNubSocket;
