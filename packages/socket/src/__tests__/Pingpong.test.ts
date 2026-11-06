import Socket from '../Socket';

type Listener = (payload?: unknown) => void;

class MockEmitter {
    listeners: Record<string, Listener[]> = {};

    on(event: string, listener: Listener) {
        (this.listeners[event] ||= []).push(listener);
        return () => {};
    }

    fire(event: string, payload?: unknown) {
        (this.listeners[event] || []).forEach((listener) => listener(payload));
    }
}

class MockSubscription extends MockEmitter {
    unsubscribed = false;

    constructor(public channel: string) {
        super();
    }

    unsubscribe() {
        this.unsubscribed = true;
    }
}

class MockClient extends MockEmitter {
    static last: MockClient | null = null;

    subscriptions: MockSubscription[] = [];
    connected = false;
    closed = false;

    constructor(public options: Record<string, unknown>) {
        super();
        MockClient.last = this;
    }

    subscribe(channel: string) {
        const subscription = new MockSubscription(channel);
        this.subscriptions.push(subscription);
        return subscription;
    }

    connect() {
        this.connected = true;
        this.fire('connected', { socketId: 'abc', recovered: false });
    }

    disconnect() {
        this.connected = false;
    }

    close() {
        this.closed = true;
    }
}

const mockLaravelAuthorizer = jest.fn((options) => ({ laravel: options }));

jest.mock('@pingpong-io/client', () => ({
    Pingpong: MockClient,
    laravelAuthorizer: mockLaravelAuthorizer,
}));

function nextTick() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

async function createSocket(options = {}) {
    const socket = new Socket({
        adapter: 'pingpong',
        url: 'https://pingpong.example.com',
        project: 'my-app',
        key: 'pk_test',
        channels: ['comments.article-1'],
        ...options,
    });
    await nextTick();
    return socket;
}

describe('the Pingpong adapter', () => {
    it('creates the client with the project, and the Laravel authorizer by default', async () => {
        await createSocket({ path: '/pingpong/socket.io', authHeaders: { 'X-CSRF-TOKEN': 't' } });
        const client = MockClient.last as MockClient;

        expect(client.options).toMatchObject({
            url: 'https://pingpong.example.com',
            project: 'my-app',
            key: 'pk_test',
            autoConnect: false,
            socketOptions: { path: '/pingpong/socket.io' },
        });
        expect(mockLaravelAuthorizer).toHaveBeenCalledWith({
            endpoint: '/broadcasting/auth',
            headers: { 'X-CSRF-TOKEN': 't' },
        });
        expect(client.subscriptions.map(({ channel }) => channel)).toEqual(['comments.article-1']);
    });

    it('starts, and passes messages as { event, data, channel }', async () => {
        const socket = await createSocket();
        const client = MockClient.last as MockClient;
        const messages: unknown[] = [];
        const started = jest.fn();
        socket.on('message', (message) => messages.push(message));
        socket.on('started', started);

        socket.start();
        expect(client.connected).toBe(true);
        expect(started).toHaveBeenCalled();

        client.subscriptions[0].fire('message', {
            channel: 'comments.article-1',
            event: 'comment.created',
            data: { id: 1 },
        });
        expect(messages).toEqual([
            { event: 'comment.created', data: { id: 1 }, channel: 'comments.article-1' },
        ]);
    });

    it('follows the channels', async () => {
        const socket = await createSocket();
        const client = MockClient.last as MockClient;

        socket.setChannels(['live']);

        expect(client.subscriptions[0].unsubscribed).toBe(true);
        expect(client.subscriptions.map(({ channel }) => channel)).toEqual([
            'comments.article-1',
            'live',
        ]);
    });

    it('reports subscription counts and resets', async () => {
        const socket = await createSocket();
        const client = MockClient.last as MockClient;
        const counts: unknown[] = [];
        const reset = jest.fn();
        socket.on('subscriptionCount', (count) => counts.push(count));
        socket.on('reset', reset);

        expect(socket.getSubscriptionCount('comments.article-1')).toBeNull();
        client.subscriptions[0].fire('subscribed', { subscriptionCount: 11 });
        expect(socket.getSubscriptionCount('comments.article-1')).toBe(11);
        client.subscriptions[0].fire('subscriptionCount', 12);
        client.fire('reset');

        expect(socket.getSubscriptionCount('comments.article-1')).toBe(12);
        expect(counts).toEqual([
            { channel: 'comments.article-1', count: 11 },
            { channel: 'comments.article-1', count: 12 },
        ]);
        expect(reset).toHaveBeenCalled();

        socket.setChannels(['live']);
        expect(socket.getSubscriptionCount('comments.article-1')).toBeNull();
    });

    it('stops, closes, and refuses to send', async () => {
        const socket = await createSocket();
        const client = MockClient.last as MockClient;
        socket.start();

        await expect(socket.send({ hello: true }, 'comments.article-1')).rejects.toThrow(
            /publish from the server/,
        );
        socket.destroy();
        expect(client.closed).toBe(true);
    });
});
