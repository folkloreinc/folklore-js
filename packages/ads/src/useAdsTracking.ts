import { useTracking } from '@folklore/tracking';
import { useCallback } from 'react';

import AdSlot, { RenderEvent } from './AdSlot';

export default function useAdsTracking() {
    const tracking = useTracking() || null;
    const trackEvent = useCallback(
        (action: string, slot: AdSlot = null, renderEvent: RenderEvent = null) => {
            if (tracking !== null && typeof tracking.trackAd === 'undefined') {
                tracking.trackAd(action, slot, renderEvent);
            }
        },
        [tracking],
    );
    return trackEvent;
}
