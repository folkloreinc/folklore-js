import PubNub from 'pubnub';
import createDebug from 'debug';
import EventEmitter from 'wolfy87-eventemitter';

const debug = createDebug('folklore:socket');

class Socket extends EventEmitter {
    constructor(opts) {
        super();
        this.options = {
            namespace: null,
            publishKey: null,
            subscribeKey: null,
            channels: [],
            ...opts,
        };

        this.onMessage = this.onMessage.bind(this);

        this.shouldStart = false;
        this.started = false;

        this.pubnub = new PubNub({
            publishKey: this.options.publishKey,
            subscribeKey: this.options.subscribeKey,
        });
        this.pubnubListener = null;

        this.channels = [];

        if (this.options.channels.length) {
            this.setChannels(this.options.channels);
        }

        this.init();
    }

    onMessage({ message }) {
        debug('Message received', message);

        this.emit('message', message);

        if (typeof message.event !== 'undefined') {
            this.emit(message.event, message.data || message);
        }
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

        debug('Setting channels:');
        channels.forEach((channel) => {
            debug(`    - ${channel}`);
        });

        const { shouldStart, started } = this;
        if (started) {
            this.stop();
        }

        this.channels = namespacedChannels;

        if (started || shouldStart) {
            this.start();
        }
    }

    addChannel(channel) {
        const namespacedChannel = this.getChannelWithNamespace(channel);
        if (this.channels.indexOf(namespacedChannel) !== -1) {
            return;
        }

        debug(`Adding channel: ${channel}`);

        const { shouldStart, started } = this;
        if (started) {
            this.stop();
        }

        this.channels.push(namespacedChannel);

        if (started || shouldStart) {
            this.start();
        }
    }

    removeChannel(channel) {
        const namespacedChannel = this.getChannelWithNamespace(channel);
        if (this.channels.indexOf(namespacedChannel) === -1) {
            return;
        }

        debug(`Removing channel: ${channel}`);

        const { shouldStart, started } = this;
        if (started) {
            this.stop();
        }

        this.channels = this.channels.filter(ch => ch !== namespacedChannel);

        if (started || shouldStart) {
            this.start();
        }
    }

    init() {
        this.pubnubListener = {
            message: this.onMessage,
        };
        this.pubnub.addListener(this.pubnubListener);
    }

    destroy() {
        this.stop();
        if (this.pubnubListener) {
            this.pubnub.removeListener(this.pubnubListener);
            this.pubnubListener = null;
        }
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
        }
        if (this.channels.length === 0) {
            debug('Skipping start: No channels.');
            this.shouldStart = true;
            return;
        }

        debug('Starting on channels:');
        this.channels.forEach((channel) => {
            debug(`- ${this.getChannelWithoutNamespace(channel)}`);
        });

        this.shouldStart = false;
        this.started = true;
        this.pubnub.subscribe({
            channels: this.channels,
        });
    }

    stop() {
        if (!this.started) {
            return;
        }
        debug('Stopping...');
        this.shouldStart = false;
        this.started = false;
        this.pubnub.unsubscribe({
            channels: this.channels,
        });
    }

    send(data, channel) {
        if (!this.started) {
            debug('Abort sending data: Not started');
            return Promise.reject();
        }
        const publishData = typeof data.channel !== 'undefined' && typeof data.message !== 'undefined' ? data : {
            channel: typeof channel !== 'undefined' ? this.getChannelWithNamespace(channel) : this.channels,
            message: data,
        };
        debug('Sending', publishData);
        return new Promise((resolve, reject) => {
            this.pubnub.publish(publishData, (status, response) => {
                if (status.error) {
                    reject(new Error(`Error operation:${status.operation} status:${status.statusCode}`));
                } else {
                    resolve({
                        status,
                        response,
                        publishData,
                    });
                }
            });
        });
    }

    isStarted() {
        return this.shouldStart || this.started;
    }
}

export default Socket;
