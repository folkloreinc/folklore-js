import React from 'react';
import TrackingContext from './TrackingContext';

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

const withTracking = (WrappedComponent) => {
    const WithTrackingComponent = props => (
        <TrackingContext.Consumer>
            {tracking => <WrappedComponent tracking={tracking} {...props} />}
        </TrackingContext.Consumer>
    );
    WithTrackingComponent.displayName = `WithTracking(${getDisplayName(WrappedComponent)})`;
    return WithTrackingComponent;
};

export default withTracking;
