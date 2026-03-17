import { useUser } from '@folklore/auth';
import { TrackingContainer } from '@folklore/tracking';
import createDebug from 'debug';
import { ReactNode, useEffect, useMemo } from 'react';

import Tracking from '../lib/Tracking';

const debug = createDebug('app:tracking');

interface TrackingProviderProps {
    children: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any> | null;
    disabled?: boolean;
}

export function TrackingProvider({
    children,
    variables = null,
    disabled = false,
}: TrackingProviderProps) {
    const user = useUser();
    const tracking = useMemo(
        () =>
            new Tracking({
                user,
                disabled,
            }),
        [],
    );

    useEffect(() => {
        if (variables !== null) {
            tracking.setVariables(variables);
        }
    }, [variables]);

    useEffect(() => {
        tracking.setUser(user);
    }, [user]);

    return <TrackingContainer tracking={tracking}>{children}</TrackingContainer>;
}

export default TrackingProvider;
