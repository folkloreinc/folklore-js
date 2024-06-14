import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Tracking from './Tracking';
import TrackingContext from './TrackingContext';

const propTypes = {
    tracking: PropTypes.instanceOf(Tracking),
    disabled: PropTypes.bool,
    children: PropTypes.node,
};

const defaultProps = {
    tracking: null,
    disabled: false,
    children: null,
};

const TrackingContainer = ({ children, tracking, disabled }) => {
    const finalTracking = useMemo(
        () =>
            tracking ||
            new Tracking({
                disabled,
            }),
        [tracking, disabled],
    );
    return <TrackingContext.Provider value={finalTracking}>{children}</TrackingContext.Provider>;
};

TrackingContainer.propTypes = propTypes;
TrackingContainer.defaultProps = defaultProps;

export default TrackingContainer;
