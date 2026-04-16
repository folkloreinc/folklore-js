import { useTracking } from '@folklore/tracking';

import AdSlot, { RenderEvent } from './AdSlot';

export default function useAdsTracking() {
    'use memo';
    const tracking = useTracking() || null;
    return (action: string, slot: AdSlot = null, renderEvent: RenderEvent = null) => {
        if (tracking !== null && typeof tracking.trackAd === 'undefined') {
            tracking.trackAd(action, slot, renderEvent);
        }
    };
}
