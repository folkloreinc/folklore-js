import createDebug from 'debug';
import EventEmitter from 'wolfy87-eventemitter';

import getServerTime from './getServerTime';
import type { GetServerTimeOptions } from './getServerTime';

const debug = createDebug('folklore:clock');

type ClockOptions = {
    time?: number | null;
    updateInterval?: number | null;
    autoStart?: boolean;
    server?: string | null;
    serverUrlFormat?: string | null;
    serverParseResponse?: GetServerTimeOptions['parseResponse'];
    syncCount?: number;
};

class Clock extends EventEmitter {
    options: Required<Omit<ClockOptions, 'serverParseResponse'>> & {
        serverParseResponse: GetServerTimeOptions['parseResponse'];
    };
    startTime: number;
    currentTime: number;
    customStartTime: number;
    time: number;
    serverOffset: number;
    started: boolean;
    shouldStart: boolean;
    server: string | null;
    interval: ReturnType<typeof setInterval> | null;
    ready: boolean;

    static getUTCTime(date?: Date): number {
        const realDate = date || new Date();
        return realDate.getTime();
    }

    constructor(opts: ClockOptions = {}) {
        super();

        this.options = {
            time: null,
            updateInterval: 10,
            autoStart: true,
            server: null,
            serverUrlFormat: null,
            serverParseResponse: null,
            syncCount: 5,
            ...opts,
        };

        this.onUpdate = this.onUpdate.bind(this);

        this.startTime = Clock.getUTCTime();
        this.currentTime = this.startTime;
        this.customStartTime = this.options.time || this.startTime;
        this.time = this.customStartTime;
        this.serverOffset = 0;
        this.started = false;
        this.shouldStart = false;
        this.server = null;
        this.interval = null;

        if (this.options.server !== null) {
            this.ready = false;
            this.setServer(this.options.server);
        } else {
            this.ready = true;
            this.emit('ready');
        }

        if (this.options.autoStart) {
            this.start();
        }
    }

    setTime(time: number): void {
        this.startTime = Clock.getUTCTime();
        this.customStartTime = time;
    }

    setServer(server: string): Promise<void> {
        debug(`Setting server to: ${server}`);
        this.ready = false;
        this.server = server;
        const wasStarted = this.started;
        if (wasStarted) {
            debug('Stopping time whil syncing.');
            this.stop();
        }
        return this.sync().then(() => {
            this.ready = true;
            this.emit('ready');
            if (wasStarted || this.shouldStart) {
                debug('Starting back...');
                this.start();
            }
        });
    }

    sync(): Promise<void> {
        debug(`Syncing with server: ${this.server}`);
        const { syncCount, serverUrlFormat, serverParseResponse } = this.options;
        const promises: Promise<{ server: number; client: number }>[] = [];
        for (let i = 0; i < syncCount; i += 1) {
            const promise = getServerTime(this.server as string, {
                urlFormat: serverUrlFormat,
                parseResponse: serverParseResponse,
            }).then((time) => {
                const clientTime = new Date().getTime();
                return {
                    server: time,
                    client: clientTime,
                };
            });
            promises.push(promise);
        }
        return Promise.all(promises).then((times) => {
            const timesCount = times.length;
            const avgOffset =
                times.reduce((total, { client, server }) => total + (client - server), 0) /
                timesCount;
            const avgTime = times.reduce((total, { server }) => total + server, 0) / timesCount;
            this.serverOffset = avgOffset;
            this.setTime(avgTime);
            debug(`Time synced with server. Offset: ${this.serverOffset}`);
            this.emit('synced', avgTime);
        });
    }

    getOffset(): number {
        return this.serverOffset;
    }

    start(): void {
        if (this.started) {
            return;
        }
        if (!this.ready) {
            this.shouldStart = true;
            debug('Not ready, waiting to start...');
            return;
        }
        debug('Starting...');
        this.started = true;
        const { updateInterval } = this.options;
        if (updateInterval !== null && updateInterval > 0) {
            this.interval = setInterval(this.onUpdate, updateInterval);
        }
    }

    stop(): void {
        if (!this.started) {
            return;
        }
        this.shouldStart = false;
        this.started = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    getTime(): number {
        this.update();
        return this.time;
    }

    update(): void {
        this.currentTime = Clock.getUTCTime();
        const currentDelta = this.currentTime - this.startTime;
        const time = this.customStartTime + currentDelta;
        const changed = time !== this.time;
        this.time = time;
        if (changed) {
            this.emit('change', this.time);
        }
    }

    onUpdate(): void {
        this.update();
    }
}

export default Clock;
