import { EventEmitter } from '@folklore/events';
import type { Authorizer, Pingpong, PingpongOptions, Subscription } from '@pingpong-io/client';

import { debug } from '../debug';
import { SocketAdapter, SocketAdapterEvents } from '../types';

export interface PingpongSocketOptions {
    /** The Pingpong server, such as `https://pingpong.example.com`. */
    url: string | null;
    project: string | null;
    /** The project's public key. */
    key: string | null;
    /** The Socket.IO path, when Pingpong is served under a path of the site (`/pingpong/socket.io`). */
    path?: string | null;
    /** Signs private channels. Defaults to Laravel's `/broadcasting/auth` (`authEndpoint`). */
    authorize?: Authorizer | null;
    authEndpoint?: string;
    authHeaders?: Record<string, string>;
    socketOptions?: PingpongOptions['socketOptions'];
    [key: string]: unknown;
}

/**
 * The adapter of Pingpong (https://github.com/folkloreinc/pingpong), through `@pingpong-io/client`.
 * Messages are `{ event, data, channel }`, as with the Pusher adapter. It also emits `reset`, when
 * the client couldn't be recovered after a disconnection and the page should reload what it shows,
 * and `subscriptionCount`, when the number of subscribers of a channel changes.
 */
class PingpongSocket extends EventEmitter<SocketAdapterEvents> implements SocketAdapter {
    options: PingpongSocketOptions;
    client: Pingpong | null;
    channels: string[];
    subscriptions: Record<string, Subscription>;
    destroyed: boolean;
    ready: boolean;
    shouldStart: boolean;
    started: boolean;
    starting: boolean;

    constructor(opts) {
        super();
        this.options = {
            url: null,
            project: null,
            key: null,
            path: null,
            authorize: null,
            authEndpoint: '/broadcasting/auth',
            ...opts,
        };

        this.client = null;
        this.channels = [];
        this.subscriptions = {};
        this.destroyed = false;
        this.ready = false;
        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        this.init();
    }

    init() {
        if (this.client !== null) {
            return;
        }
        debug('[Pingpong] Init');
        this.destroyed = false;
        import('@pingpong-io/client').then(({ Pingpong: Client, laravelAuthorizer }) => {
            if (this.destroyed) {
                return;
            }
            const {
                url,
                project,
                key,
                path = null,
                authorize = null,
                authEndpoint,
                authHeaders,
                socketOptions = {},
            } = this.options;
            this.client = new Client({
                url,
                project,
                key,
                autoConnect: false,
                authorize:
                    authorize ??
                    laravelAuthorizer({
                        endpoint: authEndpoint,
                        ...(authHeaders !== undefined ? { headers: authHeaders } : {}),
                    }),
                socketOptions: { ...socketOptions, ...(path !== null ? { path } : {}) },
            });
            this.client.on('connected', () => {
                if (!this.started) {
                    this.started = true;
                    this.starting = false;
                    this.emit('started');
                }
            });
            this.client.on('reset', () => this.emit('reset'));
            this.client.on('error', (error) => debug('[Pingpong] Error %o', error));
            this.updateSubscriptions();
            this.ready = true;
            this.emit('ready');
            if (this.shouldStart) {
                this.start();
            }
        });
    }

    updateChannels(channels) {
        const list = typeof channels === 'string' ? [channels] : channels;
        debug(`[Pingpong] Updating channels: ${list.join(', ')}`);
        this.channels = [...list];
        this.updateSubscriptions();
    }

    updateSubscriptions() {
        if (this.client === null) {
            return;
        }
        Object.keys(this.subscriptions)
            .filter((channel) => this.channels.indexOf(channel) === -1)
            .forEach((channel) => {
                this.subscriptions[channel].unsubscribe();
                delete this.subscriptions[channel];
            });
        this.channels
            .filter((channel) => typeof this.subscriptions[channel] === 'undefined')
            .forEach((channel) => {
                const subscription = this.client.subscribe(channel);
                subscription.on('message', ({ event, data }) =>
                    this.onMessage(event, data, channel),
                );
                // The count arrives with the acknowledgement, then each time it changes.
                subscription.on('subscribed', ({ subscriptionCount }) =>
                    this.emit('subscriptionCount', { channel, count: subscriptionCount }),
                );
                subscription.on('subscriptionCount', (count) =>
                    this.emit('subscriptionCount', { channel, count }),
                );
                subscription.on('error', (error) => debug('[Pingpong] %s: %o', channel, error));
                this.subscriptions[channel] = subscription;
            });
    }

    onMessage(event: string, data: unknown, channel: string) {
        this.emit('message', { event, data, channel });
        this.emit(event, data);
    }

    start() {
        if (this.started || this.starting) {
            return;
        }
        if (this.client === null) {
            this.shouldStart = true;
            return;
        }
        this.shouldStart = false;
        this.starting = true;
        this.emit('start');
        this.client.connect();
    }

    stop() {
        this.shouldStart = false;
        if (!this.started && !this.starting) {
            return;
        }
        debug('[Pingpong] Stopping...');
        this.started = false;
        this.starting = false;
        if (this.client !== null) {
            this.client.disconnect();
        }
        this.emit('stop');
    }

    destroy() {
        this.destroyed = true;
        this.stop();
        if (this.client !== null) {
            this.client.close();
            this.client = null;
        }
        this.subscriptions = {};
        this.ready = false;
        debug('[Pingpong] Destroyed.');
    }

    send() {
        // Clients don't publish to Pingpong yet: the application publishes through its API.
        return Promise.reject(
            new Error('Pingpong clients cannot send messages: publish from the server.'),
        );
    }
}

export default PingpongSocket;
