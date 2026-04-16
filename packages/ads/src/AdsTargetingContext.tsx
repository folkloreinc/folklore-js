import { ReactNode, createContext, use } from 'react';

import { AdsTargeting } from './types';

const defaultTargeting: AdsTargeting = {
    domain:
        typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.host}`
            : null,
};

const AdsTargetingContext = createContext<AdsTargeting | null>(defaultTargeting);

export const useAdsTargeting = (): AdsTargeting | null => use(AdsTargetingContext);

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
    'use memo';
    const previousTargeting = useAdsTargeting();
    const mergedTargeting = replace ? targeting : { ...previousTargeting, ...targeting };
    return <AdsTargetingContext value={mergedTargeting}>{children}</AdsTargetingContext>;
}

export default AdsTargetingContext;
