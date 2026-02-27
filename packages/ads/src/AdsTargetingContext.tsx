import { ReactNode, createContext, useContext, useMemo } from 'react';

import { AdsTargeting } from './types';

const defaultTargeting: AdsTargeting = {
    domain:
        typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.host}`
            : null,
};

const AdsTargetingContext = createContext<AdsTargeting | null>(defaultTargeting);

export const useAdsTargeting = (): AdsTargeting | null => useContext(AdsTargetingContext);

interface AdsTargetingProviderProps {
    children: ReactNode;
    targeting?: AdsTargeting;
    replace?: boolean;
}

export function AdsTargetingProvider({
    children,
    targeting = defaultTargeting,
    replace = false,
}: AdsTargetingProviderProps) {
    const previousTargeting = useAdsTargeting();
    const mergedTargeting = useMemo(
        () => (replace ? targeting : { ...previousTargeting, ...targeting }),
        [replace, previousTargeting, targeting],
    );
    return (
        <AdsTargetingContext.Provider value={mergedTargeting}>
            {children}
        </AdsTargetingContext.Provider>
    );
}

export default AdsTargetingContext;
