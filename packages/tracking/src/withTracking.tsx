import { JSX } from 'react';

import Tracking from './Tracking';
import TrackingContext from './TrackingContext';

type ComponentWithDisplayName = {
    displayName?: string;
    name?: string;
};

const getDisplayName = (WrappedComponent: ComponentWithDisplayName): string =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

const withTracking = <P extends object>(
    WrappedComponent: React.ComponentType<P & { tracking: Tracking | null }>,
) => {
    const WithTrackingComponent = (props: P): JSX.Element => (
        <TrackingContext.Consumer>
            {(tracking) => <WrappedComponent tracking={tracking} {...props} />}
        </TrackingContext.Consumer>
    );
    WithTrackingComponent.displayName = `WithTracking(${getDisplayName(WrappedComponent)})`;
    return WithTrackingComponent;
};

export default withTracking;
