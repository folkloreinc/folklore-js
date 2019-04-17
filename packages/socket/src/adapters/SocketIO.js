import createDebug from 'debug';
import EventEmitter from 'wolfy87-eventemitter';
import isArray from 'lodash/isArray';

const debug = createDebug('folklore:socket:socketio');

class SocketIOSocket extends EventEmitter {
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

        this.IO = null;
        this.io = null;
        this.sockets = {};
        this.channels = [];

        this.init();
    }

    onReady() {
        this.ready = true;
        this.emit('ready');
    }

    onConnect() {
        if (!this.started) {
            this.started = true;
            this.starting = false;
            this.emit('started');
        }
    }

    onMessage(message) {
        debug('Message received', message);

        this.emit('message', message);
    }

    init() {
        import(/* webpackChunkName: "vendor/socket.io" */ 'socket.io-client')
            .then((IO) => {
                this.IO = IO.Manager;
            })
            .then(() => this.createIO())
            .then(() => this.onReady())
            .then(() => {
                if (this.shouldStart) {
                    this.start();
                }
            });
    }

    createIO() {
        const { IO } = this;
        const { host, ...opts } = this.options;

        this.io = IO(host, {
            autoConnect: false,
            ...opts,
        });
    }

    updateChannels(channels) {
        debug(`Updating channels: ${channels.join(', ')}`);

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
            debug('Skipping start: Already started.');
            return;
        } if (this.starting) {
            debug('Skipping start: Already starting.');
            return;
        }

        if (this.io === null) {
            debug('Socket.io not ready.');
            this.shouldStart = true;
            return;
        }

        if (this.channels.length === 0) {
            debug('Skipping start: No channels.');
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
        debug('Stopping...');

        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        Object.values(this.sockets).forEach(socket => this.stopSocket(socket));

        this.emit('stop');
    }

    createSocket(channel) {
        const socket = this.io.socket(`/${channel.replace(/^\//, '')}`);
        socket.on('message', message => this.onMessage(message, channel));
        socket.on('connect', this.onConnect);
        socket.open();
        return socket;
    }

    // eslint-disable-next-line class-methods-use-this
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
            this.io.close();
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
