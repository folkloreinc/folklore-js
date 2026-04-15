import { use } from 'react';

import Tracking from './Tracking';
import TrackingContext from './TrackingContext';

function useTracking(): Tracking | null {
    'use memo';
    return use(TrackingContext);
}

export default useTracking;
