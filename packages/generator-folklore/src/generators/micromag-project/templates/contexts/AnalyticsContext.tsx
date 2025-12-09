import { useCallback, useContext, useMemo, useState, createContext, ReactNode } from 'react';

type AnalyticsContextType = {
    googleAnalyticsIds: Array<string> | null;
    setGoogleAnalyticsIds: ((val: string | null) => void) | null;
};

export const AnalyticsContext = createContext<AnalyticsContextType>({
    googleAnalyticsIds: null,
    setGoogleAnalyticsIds: null,
});

export const useAnalyticsContext = (): AnalyticsContextType => useContext(AnalyticsContext);

export const useAnalytics = () => {
    const { googleAnalyticsIds = null, setGoogleAnalyticsIds = null } = useAnalyticsContext() || {};
    return { googleAnalyticsIds, setGoogleAnalyticsIds };
};

interface AnalyticsProviderProps {
    children: ReactNode;
    googleAnalyticsIds: Array<string> | null;
}

export const AnalyticsProvider = ({
    children,
    googleAnalyticsIds: initialIds = null,
}: AnalyticsProviderProps) => {
    const [googleAnalyticsIds, setGoogleAnalyticsIdsState] = useState(initialIds);
    const setGoogleAnalyticsIds = useCallback(
        (val) => {
            setGoogleAnalyticsIdsState(val);
        },
        [setGoogleAnalyticsIdsState],
    );
    const value = useMemo(
        () => ({
            googleAnalyticsIds,
            setGoogleAnalyticsIds,
        }),
        [googleAnalyticsIds, setGoogleAnalyticsIds],
    );
    return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};
