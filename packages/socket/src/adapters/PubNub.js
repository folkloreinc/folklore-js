import createDebug from 'debug';
import EventEmitter from 'wolfy87-eventemitter';

const debug = createDebug('folklore:socket:pubnub');

class PubNubSocket extends EventEmitter {
    constructor(opts) {
        super();
        this.options = {
            uuid: null,
            publishKey: null,
            subscribeKey: null,
            secretKey: null,
            ...opts,
        };

        this.onReady = this.onReady.bind(this);
        this.onStatus = this.onStatus.bind(this);
        this.onMessage = this.onMessage.bind(this);

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
        debug(`Updating channels: ${channels.join(', ')}`);

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
        import('pubnub')
            .then(({ default: PubNub }) => {
                this.PubNub = PubNub;
            })
            .then(() => this.createPubNub())
            .then(() => this.onReady());
    }

    createPubNub() {
        const { PubNub } = this;
        const pubnubOptions = {
            publishKey: this.options.publishKey,
            subscribeKey: this.options.subscribeKey,
        };
        if (this.options.uuid !== null) {
            pubnubOptions.uuid = this.options.uuid;
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
        this.stop();

        if (this.pubnubListener) {
            this.pubnub.removeListener(this.pubnubListener);
            this.pubnubListener = null;
        }

        this.ready = false;

        debug('Destroyed.');
    }

    start() {
        if (this.started) {
            debug('Skipping start: Already started.');
            return;
        } if (this.starting) {
            debug('Skipping start: Already starting.');
            return;
        }

        if (this.channels.length === 0) {
            debug('Skipping start: No channels.');
            this.shouldStart = true;
            return;
        }

        this.shouldStart = false;
        this.starting = true;
        this.pubnub.subscribe({
            channels: this.channels,
        });

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

        this.pubnub.unsubscribe({
            channels: this.channels,
        });

        this.emit('stop');
    }

    send(data) {
        debug('Sending', data);
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
