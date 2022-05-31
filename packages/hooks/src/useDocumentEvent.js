import { useEffect } from 'react';
import EventsManager from '@folklore/events';

export const documentEventsManager = typeof document !== 'undefined' ? new EventsManager(document) : null;

const useDocumentEvent = (event, callback) => {
    useEffect(() => {
        if (documentEventsManager !== null && callback !== null) {
            documentEventsManager.subscribe(event, callback);
        }
        return () => {
            if (documentEventsManager !== null && callback !== null) {
                documentEventsManager.unsubscribe(event, callback);
            }
        };
    }, [event, callback]);
};

export default useDocumentEvent;
