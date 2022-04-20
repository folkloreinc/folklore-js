import { useEffect } from 'react';
import EventsManager from '@folklore/events';

export const eventsManager = typeof window !== 'undefined' ? new EventsManager(window) : null;

const useWindowEvent = (event, callback) => {
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

export default useWindowEvent;
