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

        this.onStatus = this.onStatus.bind(this);
        this.onMessage = this.onMessage.bind(this);

        this.shouldStart = false;
        this.started = false;
        this.starting = false;

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

    onStatus(statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory' && !this.started) {
            this.started = true;
            this.starting = false;
            this.emit('start');
        }
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

        debug(`Set channels: ${namespacedChannels.join(', ')}`);

        this.updateChannels(namespacedChannels);
    }

    addChannel(channel) {
        const namespacedChannel = this.getChannelWithNamespace(channel);
        if (this.channels.indexOf(namespacedChannel) !== -1) {
            return;
        }

        debug(`Adding channel: ${channel}`);

        this.updateChannels([
            ...this.channels,
            namespacedChannel,
        ]);
    }

    removeChannel(channel) {
        const namespacedChannel = this.getChannelWithNamespace(channel);
        if (this.channels.indexOf(namespacedChannel) === -1) {
            return;
        }

        debug(`Removing channel: ${channel}`);

        this.updateChannels([
            ...this.channels.filter(ch => ch !== namespacedChannel),
        ]);
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

    init() {
        this.pubnubListener = {
            status: this.onStatus,
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
        } else if (this.starting) {
            debug('Skipping start: Already starting.');
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
        this.starting = true;
        this.pubnub.subscribe({
            channels: this.channels,
        });
    }

    stop() {
        if (!this.started && !this.starting) {
            return;
        }
        debug('Stopping...');

        this.shouldStart = false;
        this.started = false;
        this.starting = false;

        this.pubnub.unsubscribe({
            channels: this.channels,
        });

        this.emit('stop');
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
