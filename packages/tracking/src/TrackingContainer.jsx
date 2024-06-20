import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';

import Tracking from './Tracking';
import TrackingContext from './TrackingContext';

const propTypes = {
    tracking: PropTypes.instanceOf(Tracking),
    disabled: PropTypes.bool,
    paused: PropTypes.bool,
    children: PropTypes.node,
};

const defaultProps = {
    tracking: null,
    disabled: false,
    paused: false,
    children: null,
};

function TrackingContainer({ children, tracking, disabled, paused }) {
    const finalTracking = useMemo(
        () =>
            tracking ||
            new Tracking({
                disabled,
                paused,
            }),
        [tracking],
    );
    useEffect(() => {
        if (tracking === null) {
            finalTracking.setDisabled(disabled);
            finalTracking.setPaused(paused);
        }
    }, [tracking, disabled, paused]);
    return <TrackingContext.Provider value={finalTracking}>{children}</TrackingContext.Provider>;
}

TrackingContainer.propTypes = propTypes;
TrackingContainer.defaultProps = defaultProps;

export default TrackingContainer;
