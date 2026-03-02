import { EventsManager } from '@folklore/events';
import { useEffect } from 'react';

type EventsMap<T> = {
    [K in keyof T]: T[K];
};

type WindowEventsMap = EventsMap<WindowEventMap>;

export const eventsManager =
    typeof window !== 'undefined' ? new EventsManager<WindowEventsMap>(window) : null;

export default function useWindowEvent<Event extends keyof WindowEventsMap>(
    event: Event,
    callback: ((event: WindowEventsMap[Event]) => void) | null,
) {
    useEffect(() => {
        if (eventsManager !== null && callback !== null) {
            eventsManager.subscribe(event, callback);
        }
        return () => {
            if (eventsManager !== null && callback !== null) {
                eventsManager.unsubscribe(event, callback);
            }
        };
    }, [event, callback]);
}
