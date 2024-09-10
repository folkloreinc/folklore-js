import createDebug from 'debug';
import { useEffect, useState } from 'react';

const debug = createDebug('folklore:ads');

function parseRichAd(data) {
    let richAd = null;
    try {
        const eventData = JSON.parse(data) || null;
        richAd = eventData !== null ? eventData.richAd || null : null;
    } catch (e) {}
    return richAd;
}

function useRichAd(containerRef, id, opts) {
    const [richAd, setRichAd] = useState(null);
    const { onRichAd = null } = opts || {};

    useEffect(() => {
        setRichAd(null);
        function onMessage(event) {
            if (event.origin.match(/safeframe\.googlesyndication\.com/) === null) {
                return;
            }
            const container = containerRef.current || document;
            const iframe = container.querySelector('iframe') || null;
            if (iframe === null || iframe.contentWindow !== event.source) {
                return;
            }
            const newRichAd = parseRichAd(event.data);
            if (newRichAd === null) {
                return;
            }

            debug('Received rich ad for %s %O', id, newRichAd);
            setRichAd(newRichAd);
            if (onRichAd !== null) {
                onRichAd(newRichAd);
            }
        }
        window.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('message', onMessage);
        };
    }, [id, onRichAd]);

    return richAd;
}

export default useRichAd;
