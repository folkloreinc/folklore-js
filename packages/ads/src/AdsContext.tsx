import debounce from 'lodash/debounce';
import { ElementType, ReactNode, createContext, use, useEffect, useState } from 'react';

import { getSizeFromSizeMapping, getSizeMappingFromSlot } from './utils';

import AdsManager from './AdsManager';
import { slots as defaultSlots, viewports as defaultViewports } from './defaults';
import { Slots, SlotsDefinition, Viewports } from './types';

interface AdsContextType {
    ready: boolean;
    ads?: AdsManager;
    viewports?: Viewports;
    viewport?: string | null;
    slots?: Slots;
    slotsPath?: Record<string, string>;
    trackingDisabled?: boolean;
    richAdComponents?: Record<string, ElementType>;
}

const AdsContext = createContext<AdsContextType>({
    ready: false,
});

export const useAdsContext = () => use(AdsContext);

interface AdsProviderProps {
    children: ReactNode;
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
    richAdComponents?: Record<string, ElementType> | null;
    disabled?: boolean;
    disableTracking?: boolean;
}

export function AdsProvider({
    children,
    defaultSlotPath = null,
    slotsPath = null,
    disableSingleRequest = false,
    disableVideoAds = false,
    disableLazyLoad = false,
    autoInit = true,
    resizeDebounceDelay = 500,
    refreshOnResize = false,
    mobileScaling = 1.0,
    renderMarginPercent = 100,
    fetchMarginPercent = 300,
    viewport = null,
    viewports = defaultViewports,
    slots = defaultSlots,
    richAdComponents = null,
    disabled = false,
    disableTracking = false,
}: AdsProviderProps) {
    'use memo';
    const [ready, setReady] = useState(false);
    const [ads] = useState<AdsManager | null>(
        () =>
            new AdsManager({
                autoInit,
                disabled,
                disableSingleRequest,
                disableVideoAds,
                disableLazyLoad,
                mobileScaling,
                renderMarginPercent,
                fetchMarginPercent,
            }),
    );
    if (disabled !== ads?.isDisabled()) {
        ads?.setDisabled(disabled);
    }
    if (!ready && ads?.isReady()) {
        setReady(true);
    }

    useEffect(() => {
        if (ads.isReady() || ready) {
            return () => {};
        }
        const onReady = () => setReady(true);
        ads.on('ready', onReady);
        return () => {
            ads.off('ready', onReady);
        };
    }, [ads, setReady]);

    useEffect(() => {
        if (!autoInit) {
            ads.init();
        }
    }, [ads, autoInit]);

    useEffect(() => {
        const onResize = debounce(() => ads.refreshAllSlots(), resizeDebounceDelay);
        if (refreshOnResize) {
            window.addEventListener('resize', onResize);
        }
        return () => {
            if (refreshOnResize) {
                window.removeEventListener('resize', onResize);
            }
            onResize.cancel();
        };
    }, [ads, resizeDebounceDelay, refreshOnResize]);

    const slotsWithSizeMapping = Object.keys(slots || {}).reduce((map, key) => {
        const slot = slots[key];
        const { size } = slot;
        const sizeMapping = getSizeMappingFromSlot(slot, viewports);
        return {
            ...map,
            [key]: {
                ...slot,
                size: size || getSizeFromSizeMapping(sizeMapping || null),
                sizeMapping,
            },
        };
    }, {});

    const finalSlotsPath =
        defaultSlotPath !== null && slotsPath !== null
            ? {
                  default: defaultSlotPath,
                  ...slotsPath,
              }
            : slotsPath;

    const value = {
        ready,
        ads,
        viewports,
        viewport,
        slots: slotsWithSizeMapping,
        slotsPath: finalSlotsPath,
        trackingDisabled: disableTracking,
        richAdComponents,
    };

    return <AdsContext value={value}>{children}</AdsContext>;
}

export default AdsContext;
