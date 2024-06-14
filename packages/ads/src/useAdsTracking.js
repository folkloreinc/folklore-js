import { useTracking } from '@folklore/tracking';
import { useCallback } from 'react';

export default function useAdsTracking() {
    const tracking = useTracking() || null;
    const trackEvent = useCallback(
        (action, slot, renderEvent) => {
            if (tracking !== null && typeof tracking.trackAd !== 'undefined') {
                tracking.trackAd(action, slot, renderEvent);
            }
        },
        [tracking],
    );
    return trackEvent;
}
