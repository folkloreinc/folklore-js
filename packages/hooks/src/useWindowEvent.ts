import EventsManager from '@folklore/events';
import { useEffect } from 'react';

export const eventsManager = typeof window !== 'undefined' ? new EventsManager(window) : null;

export default function useWindowEvent(event, callback) {
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
