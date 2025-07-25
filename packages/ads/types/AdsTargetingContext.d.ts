import { ReactNode } from 'react';
import { AdsTargeting } from './types';
interface AdsTargetingProviderProps {
    children: ReactNode;
    targeting?: AdsTargeting;
    replace?: boolean;
}
declare const AdsTargetingContext: import("react").Context<AdsTargeting>;
export declare const useAdsTargeting: () => AdsTargeting | null;
export declare function AdsTargetingProvider({ children, targeting, replace, }: AdsTargetingProviderProps): import("react/jsx-runtime").JSX.Element;
export default AdsTargetingContext;
