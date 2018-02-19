import EventEmitter from 'wolfy87-eventemitter';
import createDebug from 'debug';

import getServerTime from './getServerTime';

const debug = createDebug('folklore:clock');

class Clock extends EventEmitter {
    static getUTCTime(date) {
        const realDate = date || new Date();
        return realDate.getTime();
    }

    constructor(opts) {
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

    setTime(time) {
        this.startTime = Clock.getUTCTime();
        this.customStartTime = time;
    }

    setServer(server) {
        debug(`Setting server to: ${server}`);
        this.ready = false;
        this.server = server;
        const wasStarted = this.started;
        if (wasStarted) {
            this.stop();
        }
        return this.sync()
            .then(() => {
                this.ready = true;
                this.emit('ready');
                if (wasStarted || this.shouldStart) {
                    this.start();
                }
            });
    }

    sync() {
        debug(`Syncing with server: ${this.server}`);
        const { syncCount, serverUrlFormat, serverParseResponse } = this.options;
        const promises = [];
        for (let i = 0; i < syncCount; i += 1) {
            const promise = getServerTime(this.server, {
                urlFormat: serverUrlFormat,
                parseResponse: serverParseResponse,
            }).then((time) => {
                const clientTime = (new Date()).getTime();
                return {
                    server: time,
                    client: clientTime,
                };
            });
            promises.push(promise);
        }
        return Promise.all(promises)
            .then((times) => {
                const timesCount = times.length;
                const avgOffset = times.reduce((total, { client, server }) => (
                    total + (client - server)
                ), 0) / timesCount;
                const avgTime = times.reduce((total, { server }) => (
                    total + server
                ), 0) / timesCount;
                this.serverOffset = avgOffset;
                this.setTime(avgTime);
                debug(`Time synced with server. Offset: ${this.serverOffset}`);
                this.emit('synced', avgTime);
            });
    }

    getOffset() {
        return this.serverOffset;
    }

    start() {
        if (this.started) {
            return;
        }
        if (!this.ready) {
            this.shouldStart = true;
            return;
        }
        this.started = true;
        const { updateInterval } = this.options;
        if (updateInterval !== null && updateInterval > 0) {
            this.interval = setInterval(this.onUpdate, updateInterval);
        }
    }

    stop() {
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

    getTime() {
        this.update();
        return this.time;
    }

    update() {
        this.currentTime = Clock.getUTCTime();
        const currentDelta = this.currentTime - this.startTime;
        const time = this.customStartTime + currentDelta;
        const changed = time !== this.time;
        this.time = time;
        if (changed) {
            this.emit('change', this.time);
        }
    }

    onUpdate() {
        this.update();
    }
}

export default Clock;
