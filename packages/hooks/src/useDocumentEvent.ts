import { EventsManager } from '@folklore/events';
import { useEffect } from 'react';

type EventsMap<T> = {
    [K in keyof T]: T[K];
};

type DocumentEventsMap = EventsMap<DocumentEventMap>;

export const eventsManager =
    typeof document !== 'undefined' ? new EventsManager<DocumentEventsMap>(document) : null;

export default function useDocumentEvent<Event extends keyof DocumentEventsMap>(
    event: Event,
    callback: ((event: DocumentEventsMap[Event]) => void) | null,
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
