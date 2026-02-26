import { supportsPassiveEvents } from 'detect-passive-events';
import { EventType } from 'mitt';

import EventEmitter, { Events } from './EventEmitter';

export const passiveEvents = ['scroll', 'touchstart', 'touchend', 'touchmove'];

type EventCallback = (...args: unknown[]) => void;
type ListenerCallback<Payload> = (payload: Payload) => void;
type ListenersByEvent = Record<string, EventCallback[]>;
type NativeListenersByEvent<TEvents extends Events> = Record<
    EventType,
    ListenerCallback<TEvents[EventType]>
>;

type EventTargetLike = {
    addEventListener: (
        event: string,
        listener: EventCallback,
        options?: AddEventListenerOptions | boolean,
    ) => void;
    removeEventListener: (event: string, listener: EventCallback) => void;
};

class EventsManager<TEvents extends Events = Events> extends EventEmitter<TEvents> {
    element: EventTargetLike;
    events: ListenersByEvent;
    listeners: NativeListenersByEvent<TEvents>;

    constructor(element: EventTargetLike) {
        super();

        this.element = element;
        this.events = {};
        this.listeners = {};
    }

    subscribe(event: string, callback: EventCallback): void {
        this.on(event, callback);

        this.events = {
            ...this.events,
            [event]: [...(this.events[event] || []), callback],
        };

        if (this.events[event].length === 1) {
            this.addEventListener(event);
        }
    }

    unsubscribe(event: string, callback: EventCallback): void {
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
        }, {} as ListenersByEvent);

        if (typeof this.events[event] === 'undefined') {
            this.removeEventListener(event);
        }
    }

    addEventListener(event: string): void {
        if (typeof this.listeners[event] === 'undefined') {
            this.listeners[event] = (payload) => this.emit(event, payload);
        }
        const needsPassive = passiveEvents.indexOf(event) !== -1;
        if (needsPassive && supportsPassiveEvents === true) {
            this.element.addEventListener(event, this.listeners[event], { passive: true });
            return;
        }
        if (needsPassive && supportsPassiveEvents === false) {
            this.element.addEventListener(event, this.listeners[event], false);
            return;
        }
        this.element.addEventListener(event, this.listeners[event]);
    }

    removeEventListener(event: string): void {
        this.element.removeEventListener(event, this.listeners[event]);
    }
}

export default EventsManager;
