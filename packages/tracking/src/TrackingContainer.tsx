import React, { type ReactNode, useEffect, useMemo } from 'react';

import Tracking from './Tracking';
import TrackingContext from './TrackingContext';

type TrackingContainerProps = {
    tracking?: Tracking | null;
    disabled?: boolean;
    paused?: boolean;
    children?: ReactNode;
};

function TrackingContainer({
    children = null,
    tracking = null,
    disabled = false,
    paused = false,
}: TrackingContainerProps): React.JSX.Element {
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

export default TrackingContainer;
