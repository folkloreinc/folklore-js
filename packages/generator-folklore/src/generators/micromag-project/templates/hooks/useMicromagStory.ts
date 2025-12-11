import { getJSON } from '@folklore/fetch';
import { useEffect, useState } from 'react';

import addTrackingCodesToStory from '../lib/addTrackingCodesToStory';

import { useAnalytics } from '../contexts/AnalyticsContext';
import { MicromagItem } from '../types/micromag';

const cache = new Map();

export function useMicromagStory(initialMicromag: MicromagItem) {
    const { googleAnalyticsIds = null } = useAnalytics();

    const [micromag, setMicromag] = useState(initialMicromag);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (micromag === null) {
            return;
        }
        const { url = null } = micromag || {};
        const previous = cache.get(url) || null;

        if (previous === null && url !== null) {
            setLoading(true);
            getJSON(url)
                .then((newMicromag) => {
                    cache.set(url, newMicromag);
                    setMicromag({
                        ...micromag,
                        story: addTrackingCodesToStory(newMicromag, googleAnalyticsIds),
                    });
                    setLoading(false);
                })
                .catch(() => {
                    // Load failure
                    setLoading(false);
                });
        }
    }, [setLoading, setMicromag, micromag, googleAnalyticsIds]);

    return {
        story: micromag?.story || null,
        loading,
    };
}

export default useMicromagStory;
