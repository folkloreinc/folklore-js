import React from 'react';
import AdsManager from './AdsManager';
import { Slots, SlotsDefinition, Viewports } from './types';
interface AdsContextType {
    ready: boolean;
    ads?: AdsManager;
    viewports?: Viewports;
    viewport?: string | null;
    slots?: Slots;
    slotsPath?: Record<string, string>;
    trackingDisabled?: boolean;
    richAdComponents?: Record<string, React.ElementType>;
}
declare const AdsContext: React.Context<AdsContextType>;
export declare const useAdsContext: () => AdsContextType;
interface AdsProviderProps {
    children: React.ReactNode;
    defaultSlotPath?: string | null;
    slotsPath?: Record<string, string> | null;
    disableSingleRequest?: boolean;
    disableVideoAds?: boolean;
    disableLazyLoad?: boolean;
    autoInit?: boolean;
    resizeDebounceDelay?: number;
    refreshOnResize?: boolean;
    mobileScaling?: number;
    renderMarginPercent?: number;
    fetchMarginPercent?: number;
    viewport?: string | null;
    viewports?: Viewports;
    slots?: SlotsDefinition;
    richAdComponents?: Record<string, React.ElementType> | null;
    disabled?: boolean;
    disableTracking?: boolean;
}
export declare function AdsProvider({ children, defaultSlotPath, slotsPath, disableSingleRequest, disableVideoAds, disableLazyLoad, autoInit, resizeDebounceDelay, refreshOnResize, mobileScaling, renderMarginPercent, fetchMarginPercent, viewport, viewports, slots, richAdComponents, disabled, disableTracking, }: AdsProviderProps): import("react/jsx-runtime").JSX.Element;
export default AdsContext;
