import React, { type ReactNode, useEffect, useState } from 'react';

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
    'use memo';
    const [finalTracking] = useState(() =>
        tracking === null
            ? new Tracking({
                  disabled,
                  paused,
              })
            : null,
    );
    useEffect(() => {
        if (finalTracking !== null) {
            finalTracking.setDisabled(disabled);
            finalTracking.setPaused(paused);
        }
    }, [finalTracking, disabled, paused]);
    return <TrackingContext value={tracking || finalTracking}>{children}</TrackingContext>;
}

export default TrackingContainer;
