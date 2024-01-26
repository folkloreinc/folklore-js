import { useTracking } from '@folklore/tracking';
import { useCallback } from 'react';

export default function useTrackAd() {
    const tracking = useTracking();
    const trackEvent = useCallback(
        (action, slot, renderEvent) => {
            if (typeof tracking.trackAd !== 'undefined') {
                tracking.trackAd(action, slot, renderEvent);
            }
        },
        [tracking],
    );
    return trackEvent;
}
