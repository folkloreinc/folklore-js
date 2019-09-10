import { useContext } from 'react';
import TrackingContext from './TrackingContext';

const useTracking = () => useContext(TrackingContext);

export default useTracking;
