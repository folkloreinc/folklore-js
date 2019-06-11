import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Tracking from './Tracking';
import TrackingContext from './TrackingContext';

const propTypes = {
    tracking: PropTypes.instanceOf(Tracking),
    children: PropTypes.node,
};

const defaultProps = {
    tracking: null,
    children: null,
};

const TrackingContainer = ({ children, tracking }) => {
    const finalTracking = useMemo(() => tracking || new Tracking(), [tracking]);
    return (
        <TrackingContext.Provider value={finalTracking}>
            {children}
        </TrackingContext.Provider>
    );
};

TrackingContainer.propTypes = propTypes;
TrackingContainer.defaultProps = defaultProps;

export default TrackingContainer;
