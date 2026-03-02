import { supportsPassiveEvents } from 'detect-passive-events';

import EventEmitter, { EventsMap } from './EventEmitter';

export const passiveEvents = ['scroll', 'touchstart', 'touchend', 'touchmove'];

type Callback<Payload = unknown> = (payload: Payload) => void;
type ListenersByEvent<TEvents extends EventsMap> = {
    [Event in keyof TEvents]: Callback<TEvents[Event]>[];
};
type UniqueListenersByEvent<TEvents extends EventsMap> = {
    [Event in keyof TEvents]: Callback<TEvents[Event]>;
};

type EventTargetLike<TEvents extends EventsMap> = {
    addEventListener: <Event extends keyof TEvents>(
        event: Event,
        listener: Callback<TEvents[Event]>,
        options?: { passive?: boolean } | boolean,
    ) => void;
    removeEventListener: <Event extends keyof TEvents>(
        event: Event,
        listener: Callback<TEvents[Event]>,
    ) => void;
};

class EventsManager<TEvents extends EventsMap = EventsMap> extends EventEmitter<TEvents> {
    element: EventTargetLike<TEvents>;
    events: ListenersByEvent<TEvents> | null;
    listeners: UniqueListenersByEvent<TEvents>;

    constructor(element: EventTargetLike<TEvents>) {
        super();

        this.element = element;
        this.events = {} as ListenersByEvent<TEvents>;
        this.listeners = {} as UniqueListenersByEvent<TEvents>;
    }

    subscribe<Event extends keyof TEvents>(event: Event, callback: Callback<TEvents[Event]>): void {
        this.on(event, callback);

        this.events = {
            ...this.events,
            [event]: [...(this.events[event] || []), callback],
        };

        if (this.events[event].length === 1) {
            this.addEventListener(event);
        }
    }

    unsubscribe<Event extends keyof TEvents>(
        event: Event,
        callback: Callback<TEvents[Event]>,
    ): void {
        this.off(event, callback);

        this.events = Object.keys(this.events).reduce((newEvents, eventName) => {
            if (eventName !== event) {
                return {
                    ...newEvents,
                    [eventName]: this.events[eventName],
                };
            }
            const newListeners = this.events[eventName].filter((listener) => listener !== callback);
            return newListeners.length > 0
                ? {
                      ...newEvents,
                      [eventName]: newListeners,
                  }
                : newEvents;
        }, {} as ListenersByEvent<TEvents>);

        if (typeof this.events[event] === 'undefined') {
            this.removeEventListener(event);
        }
    }

    addEventListener<Event extends keyof TEvents>(event: Event): void {
        if (typeof this.listeners[event] === 'undefined') {
            this.listeners[event] = (payload) => this.emit(event, payload);
        }
        const needsPassive = passiveEvents.indexOf(event as string) !== -1;
        if (needsPassive && supportsPassiveEvents === true) {
            this.element.addEventListener(event, this.listeners[event], {
                passive: true,
            });
            return;
        }
        if (needsPassive && supportsPassiveEvents === false) {
            this.element.addEventListener(event, this.listeners[event], false);
            return;
        }
        this.element.addEventListener(event, this.listeners[event]);
    }

    removeEventListener<Event extends keyof TEvents>(event: Event): void {
        this.element.removeEventListener(event, this.listeners[event]);
    }
}

export default EventsManager;
