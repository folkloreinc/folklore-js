import { EventEmitter } from '@folklore/events';

export interface SocketAdapterOptions {
    [key: string]: unknown;
}

export type SocketAdapterEvents = {
    ready?: void;
    start?: void;
    started?: void;
    stop?: number;
    message?: unknown;
    /** The client reconnected without the messages it missed: reload what the page shows. */
    reset?: void;
    /** The number of subscribers of a channel changed, for adapters that know it. */
    subscriptionCount?: { channel: string; count: number };
};

export interface SocketAdapter extends EventEmitter<SocketAdapterEvents> {
    destroy: () => void;
    start: () => void;
    stop: () => void;
    send: (data: unknown) => void;
    updateChannels: (channels: string[] | string) => void;
}

export interface SocketAdapterContructor {
    new (options?: SocketAdapterOptions): SocketAdapter;
}
