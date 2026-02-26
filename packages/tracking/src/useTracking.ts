import { useContext } from 'react';

import Tracking from './Tracking';
import TrackingContext from './TrackingContext';

function useTracking(): Tracking | null {
    return useContext(TrackingContext);
}

export default useTracking;
