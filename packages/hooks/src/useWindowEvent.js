import { useEffect } from 'react';
import EventsManager from '@folklore/events';

export const windowEventsManager = typeof window !== 'undefined' ? new EventsManager(window) : null;

const useWindowEvent = (event, callback) => {
    useEffect(() => {
        if (windowEventsManager !== null && callback !== null) {
            windowEventsManager.subscribe(event, callback);
        }
        return () => {
            if (windowEventsManager !== null && callback !== null) {
                windowEventsManager.unsubscribe(event, callback);
            }
        };
    }, [event, callback]);
};

export default useWindowEvent;
