import { createContext } from 'react';

import Tracking from './Tracking';

const TrackingContext = createContext<Tracking | null>(null);

export default TrackingContext;
