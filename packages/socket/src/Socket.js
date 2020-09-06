import createDebug from 'debug';
import EventEmitter from 'wolfy87-eventemitter';
import invariant from 'invariant';
import isFunction from 'lodash/isFunction';

import SocketAdapters from './adapters/index';

const normalize = str => str.replace(/[^a-z0-9]+/gi, '').toLowerCase();

const debug = createDebug('folklore:socket');

class Socket extends EventEmitter {
    static getAdapters() {
        return Socket.adapters;
    }

    static getAdapter(adapter) {
        // prettier-ignore
        const adapterKey = Object.keys(Socket.adapters).find(key => (
            normalize(key) === normalize(adapter)
        )) || null;
        if (adapterKey === null) {
            throw new Error(`Adapter ${adapter} not found`);
        }
        return Socket.adapters[adapterKey];
    }

    static addAdapter(name, adapter) {
        Socket.adapters = {
            ...Socket.adapters,
            [name]: adapter,
        };
        return Socket;
    }

    static setAdapters(adapters) {
        Socket.adapters = adapters;
        return Socket;
    }

    constructor(opts) {
        super();
        this.options = {
            adapter: 'pubnub',
            namespace: null,
            uuid: null,
            publishKey: null,
            subscribeKey: null,
            secretKey: null,
            channels: [],
            ...opts,
        };

        this.onAdapterReady = this.onAdapterReady.bind(this);
        this.onAdapterStart = this.onAdapterStart.bind(this);
        this.onAdapterStarted = this.onAdapterStarted.bind(this);
        this.onAdapterMessage = this.onAdapterMessage.bind(this);
        this.onAdapterStop = this.onAdapterStop.bind(this);

        this.shouldStart = false;
        this.started = false;
        this.starting = false;
        this.ready = false;

        this.adapter = null;
        this.channels = [];

        this.init();

        if (this.options.channels.length) {
            this.setChannels(this.options.channels);
        }
    }

    onAdapterReady() {
        debug('Adapter ready');
        this.ready = true;

        this.emit('ready');

        if (this.shouldStart) {
            this.shouldStart = false;
            this.start();
        }
    }

    onAdapterStart() {
        debug('Adapter starting...');
        this.starting = true;
        this.started = false;

        this.emit('start');
    }

    onAdapterStarted() {
        debug('Adapter started');
        this.starting = false;
        this.started = true;

        this.emit('started');
    }

    onAdapterStop() {
        debug('Adapter stopped');
        this.starting = false;
        this.started = false;

        this.emit('stop');
    }

    onAdapterMessage(message) {
        debug('Adapter message', message);
        this.emit('message', message);
    }

    getChannelWithoutNamespace(name) {
        if (this.options.namespace === null) {
            return name;
        }
        const regExp = new RegExp(`^${this.options.namespace}:`);
        return name.replace(regExp, '');
    }

    getChannelWithNamespace(name) {
        const parts = [];
        if (this.options.namespace !== null) {
            parts.push(this.options.namespace);
        }
        parts.push(name);
        return parts.join(':');
    }

    setChannels(channels) {
        const namespacedChannels = channels.map(channel => this.getChannelWithNamespace(channel));
        if (this.channels.join(',') === namespacedChannels.join(',')) {
            return;
        }

        debug(`Set channels: ${namespacedChannels.join(', ')}`);

        this.updateChannels(namespacedChannels);
    }

    addChannel(channel) {
        const namespacedChannel = this.getChannelWithNamespace(channel);
        if (this.channels.indexOf(namespacedChannel) !== -1) {
            return;
        }

        debug(`Adding channel: ${channel}`);

        this.updateChannels([...this.channels, namespacedChannel]);
    }

    removeChannel(channel) {
        const namespacedChannel = this.getChannelWithNamespace(channel);
        if (this.channels.indexOf(namespacedChannel) === -1) {
            return;
        }

        debug(`Removing channel: ${channel}`);

        this.updateChannels([...this.channels.filter(ch => ch !== namespacedChannel)]);
    }

    updateChannels(channels) {
        debug(`Updating channels: ${channels.join(', ')}`);

        this.channels = [...channels];

        if (this.adapter !== null) {
            this.adapter.updateChannels(channels);
        }
    }

    init() {
        const { adapter: adapterKey, channels, ...adapterOptions } = this.options;
        const SocketAdapter = Socket.getAdapter(adapterKey);

        this.adapter = new SocketAdapter(adapterOptions);

        const methods = ['start', 'stop', 'destroy', 'updateChannels', 'send'];
        methods.forEach((method) => {
            invariant(
                isFunction(this.adapter[method] || null),
                `Socket adapter should implement method ${method}`,
            );
        });

        this.adapter.on('ready', this.onAdapterReady);
        this.adapter.on('start', this.onAdapterStart);
        this.adapter.on('started', this.onAdapterStarted);
        this.adapter.on('message', this.onAdapterMessage);
        this.adapter.on('stop', this.onAdapterStop);
    }

    destroy() {
        if (this.adapter !== null) {
            this.adapter.removeAllListeners();
            this.adapter.destroy();
            this.adapter = null;
        }

        this.started = false;
        this.starting = false;
        this.ready = false;

        debug('Destroyed.');
    }

    restart() {
        this.stop();
        this.start();
    }

    start() {
        if (this.started) {
            debug('Skipping start: Already started.');
            return;
        } if (this.starting) {
            debug('Skipping start: Already starting.');
            return;
        }

        if (!this.ready) {
            debug('Skipping start: No ready.');
            this.shouldStart = true;
            return;
        }

        this.shouldStart = false;

        debug('Starting on channels:');
        this.channels.forEach((channel) => {
            debug(`- ${this.getChannelWithoutNamespace(channel)}`);
        });

        this.adapter.start();
    }

    stop() {
        this.shouldStart = false;

        if (!this.started && !this.starting) {
            return;
        }
        debug('Stopping...');

        if (this.adapter !== null) {
            this.adapter.stop();
        }
    }

    send(data, channel) {
        if (!this.started) {
            debug('Abort sending data: Not started');
            return Promise.reject();
        }

        const publishData = typeof data.channel !== 'undefined' && typeof data.message !== 'undefined'
            ? data
            : {
                channel:
                          typeof channel !== 'undefined'
                              ? this.getChannelWithNamespace(channel)
                              : this.channels,
                message: data,
            };
        debug('Sending', publishData);

        return this.adapter.send(publishData);
    }

    isStarted() {
        return this.started;
    }
}

Socket.adapters = {
    ...SocketAdapters,
};

export default Socket;
