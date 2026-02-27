import mitt, { Emitter, EventType } from 'mitt';

class EventEmitter<TEvents extends Record<EventType, unknown> = Record<EventType, unknown>> {
    mitt: Emitter<TEvents>;

    constructor() {
        this.mitt = mitt<TEvents>();
    }

    on<Event extends keyof TEvents>(
        event: Event,
        handler: (payload: TEvents[Event]) => void,
    ): void {
        this.mitt.on(event, handler);
    }

    off<Event extends keyof TEvents>(
        event: Event,
        handler?: (payload: TEvents[Event]) => void,
    ): void {
        this.mitt.off(event, handler);
    }

    emit<Event extends keyof TEvents>(event: Event, payload?: TEvents[Event]): void {
        this.mitt.emit(event, payload);
    }

    once<Event extends keyof TEvents>(
        event: Event,
        callback: (payload: TEvents[Event]) => void,
    ): void {
        const onceCallback = (payload: TEvents[Event]) => {
            callback(payload);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    removeAllListeners<Event extends keyof TEvents>(event: Event = null): void {
        if (event !== null) {
            this.mitt.off(event);
        } else {
            this.mitt.all.clear();
        }
    }

    addListener<Event extends keyof TEvents>(
        event: Event,
        handler: (payload: TEvents[Event]) => void,
    ): void {
        this.on(event, handler);
    }

    removeListener<Event extends keyof TEvents>(
        event: Event,
        handler?: (payload: TEvents[Event]) => void,
    ): void {
        this.off(event, handler);
    }
}

export default EventEmitter;
