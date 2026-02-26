/* eslint-disable react/jsx-props-no-spreading */
import debounce from 'lodash/debounce';
import { useState, useContext, useEffect, useMemo, useRef, ElementType, createContext, ReactNode } from 'react';

import { getSizeFromSizeMapping, getSizeMappingFromSlot } from './utils';

import AdsManager from './AdsManager';
import { viewports as defaultViewports, slots as defaultSlots } from './defaults';
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

export const useAdsContext = () => useContext(AdsContext);

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
    const [ready, setReady] = useState(false);
    const adsRef = useRef<AdsManager | null>(null);
    const ads = useMemo(() => {
        if (adsRef.current === null) {
            adsRef.current = new AdsManager({
                autoInit,
                disabled,
                disableSingleRequest,
                disableVideoAds,
                disableLazyLoad,
                mobileScaling,
                renderMarginPercent,
                fetchMarginPercent,
            });
        } else {
            adsRef.current.setDisabled(disabled);
        }
        return adsRef.current;
    }, [
        autoInit,
        disabled,
        disableSingleRequest,
        disableVideoAds,
        disableLazyLoad,
        mobileScaling,
        renderMarginPercent,
        fetchMarginPercent,
    ]);

    useEffect(() => {
        let onReady: (() => void) | null = null;
        if (!ads.isReady()) {
            onReady = () => setReady(true);
            ads.on('ready', onReady);
        } else {
            setReady(true);
        }
        return () => {
            if (onReady != null) {
                ads.off('ready', onReady);
            }
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

    const slotsWithSizeMapping = useMemo<Slots>(
        () =>
            Object.keys(slots || {}).reduce((map, key) => {
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
            }, {}),
        [slots, viewports],
    );

    const finalSlotsPath = useMemo(() => {
        if (defaultSlotPath !== null && slotsPath) {
            return {
                default: defaultSlotPath,
                ...slotsPath,
            };
        }
        return slotsPath ? { ...slotsPath } : {};
    }, [defaultSlotPath, slotsPath]);

    const value = useMemo<AdsContextType>(
        () => ({
            ready,
            ads,
            viewports,
            viewport,
            slots: slotsWithSizeMapping,
            slotsPath: finalSlotsPath,
            trackingDisabled: disableTracking,
            richAdComponents,
        }),
        [
            ready,
            ads,
            viewports,
            viewport,
            slotsWithSizeMapping,
            finalSlotsPath,
            disableTracking,
            richAdComponents,
        ],
    );

    return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export default AdsContext;
