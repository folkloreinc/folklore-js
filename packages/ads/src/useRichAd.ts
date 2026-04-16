import createDebug from 'debug';
import { useEffect, useState } from 'react';

import { RichAdType } from './types';

const debug = createDebug('folklore:ads');

function parseRichAd(data): RichAdType | null {
    let richAd = null;
    try {
        const eventData = JSON.parse(data) || null;
        richAd = eventData !== null ? eventData.richAd || null : null;
    } catch {
        richAd = null;
        console.warn('Failed to parse rich ad data', data);
    }
    return richAd;
}

interface UseRichAdOptions {
    onRichAd?: (richAd: RichAdType) => void | null;
}

function useRichAd(containerRef, id: string, opts: UseRichAdOptions = {}) {
    'use memo';
    const { onRichAd = null } = opts || {};
    const [richAd, setRichAd] = useState(null);
    const [richAdId, setRichAdId] = useState(id);
    if (richAdId !== id) {
        setRichAdId(id);
        setRichAd(null);
    }

    useEffect(() => {
        if (id === null) {
            return () => {};
        }
        function onMessage(event) {
            if (event.origin.match(/safeframe\.googlesyndication\.com/) === null) {
                return;
            }
            const container = containerRef.current || null;
            const iframe = container !== null ? container.querySelector('iframe') || null : null;
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
