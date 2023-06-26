import { useEffect } from 'react';
import EventsManager from '@folklore/events';

export const eventsManager = typeof document !== 'undefined' ? new EventsManager(document) : null;

export default function useDocumentEvent (event, callback) {
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
};
