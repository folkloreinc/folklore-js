import { useIntersectionObserver, useWindowEvent } from '@folklore/hooks';
import { useEffect, useState, useCallback, useRef, useMemo, useId } from 'react';

import AdSlot from './AdSlot';
import { useAdsContext } from './AdsContext';
import { AdSizeMapping, AdsTargeting } from './types';
import useAdsTracking from './useAdsTracking';

interface UseAdOptions {
    id?: string;
    sizeMapping?: AdSizeMapping[] | null;
    viewport?: string | null;
    targeting?: AdsTargeting | null;
    categoryExclusions?: string[] | null;
    refreshInterval?: number | null;
    alwaysRender?: boolean;
    onRender?: (event: any) => void | null;
    onDestroy?: (event: any) => void | null;
    disabled?: boolean;
    disableTracking?: boolean;
    rootMargin?: string;
}

function useAd(
    path: string,
    size,
    {
        id,
        sizeMapping = null,
        viewport = null,
        targeting = null,
        categoryExclusions = null,
        refreshInterval = null,
        alwaysRender = false,
        onRender = null,
        onDestroy = null,
        disabled = false,
        disableTracking = false,
        rootMargin = '300px',
    }: UseAdOptions = {},
) {
    const {
        ads: adsManager,
        viewports,
        ready: adsReady,
        trackingDisabled: globalTrackingDisabled = false,
    } = useAdsContext();

    const trackAd = useAdsTracking();
    const track = useCallback(
        (action: string, slot: AdSlot = null, renderEvent: any = null) => {
            if (!disableTracking && !globalTrackingDisabled) {
                trackAd(action, slot, renderEvent);
            }
        },
        [disableTracking, globalTrackingDisabled, trackAd],
    );

    // Check for visibility
    const {
        ref: refObserver,
        entry: { isIntersecting },
    } = useIntersectionObserver({
        rootMargin,
        disabled,
    });

    // Window blur
    const [windowActive, setWindowActive] = useState(true); // eslint-disable-line
    const onWindowBlur = useCallback(() => setWindowActive(false), [setWindowActive]);
    const onWindowFocus = useCallback(() => setWindowActive(true), [setWindowActive]);
    useWindowEvent('blur', onWindowBlur);
    useWindowEvent('focus', onWindowFocus);

    const isVisible = isIntersecting; /* && windowActive */

    // Current render event
    const [renderEvent, setRenderEvent] = useState(null);

    // Create slot
    const slotRef = useRef(null);
    // const { current: slot } = slotRef;
    // const [slot, setSlot] = useState(null);
    const slot = useMemo(() => {
        const { current: currentSlot = null } = slotRef;
        if (currentSlot !== null) {
            adsManager.destroySlot(currentSlot);
        }

        const viewportSize = viewport !== null ? viewports[viewport] || null : null;
        const [, viewportFixedSize = null] =
            sizeMapping !== null && viewportSize !== null
                ? sizeMapping.find(
                      ([itViewport]) => itViewport.join('x') === viewportSize.join('x'),
                  ) || []
                : [];

        const newSlot =
            path !== null && !disabled
                ? adsManager.createSlot(path, viewportFixedSize || size, {
                      id,
                      visible: isVisible,
                      sizeMapping: viewportFixedSize === null ? sizeMapping : null,
                      targeting,
                      categoryExclusions,
                  })
                : null;
        slotRef.current = newSlot;
        return newSlot;
        // // setSlot(newSlot);
        // // if (currentSlot.current !== null && adsReady) {
        // //     adsManager.defineSlot(currentSlot.current);
        // // }
        // // return currentSlot.current;
        // return () => {
        //     slotRef.current = null;
        //     if (newSlot !== null) {
        //         adsManager.destroySlot(newSlot);
        //     }
        // };
    }, [adsManager, path, disabled, size, sizeMapping, viewport, categoryExclusions, id]);

    useEffect(() => {
        if (slot !== null) {
            slot.setTargeting(targeting);
        }
    }, [slot, targeting]);

    // Set visibility
    useEffect(() => {
        if (slot !== null) {
            slot.setVisible(isVisible);
        }
    }, [slot, isVisible]);

    // Render ad when visible
    useEffect(() => {
        const slotReady = slot !== null && !slot.isDefined();
        if (adsReady && slotReady) {
            adsManager.defineSlot(slot);
        }
    }, [adsManager, adsReady, slot]);

    useEffect(() => {
        const slotReady = slot !== null && !slot.isDisplayed();
        if (adsReady && slotReady && (alwaysRender || isVisible)) {
            adsManager.displaySlot(slot);
            track('Init', slot);
        }
    }, [adsManager, adsReady, slot, alwaysRender, isVisible, track]);

    // Refresh ads slot
    useEffect(() => {
        let interval = null;
        const slotReady = slot !== null && slot.isDefined();
        if (adsReady && slotReady && isVisible && refreshInterval !== null) {
            interval = setInterval(() => {
                adsManager.refreshSlot(slot);
                track('Refresh', slot);
            }, refreshInterval);
        }
        return () => {
            if (interval !== null) {
                clearInterval(interval);
            }
        };
    }, [adsManager, adsReady, slot, isVisible, refreshInterval, track]);

    // Listen to render event
    useEffect(() => {
        if (slot === null) {
            if (renderEvent !== null) {
                setRenderEvent(null);
            }
            return () => {};
        }
        const onSlotRender = (event) => {
            const newRenderEvent = {
                ...event,
                ...(slot !== null ? slot.getRenderedSize() : null),
                slot,
            };
            setRenderEvent(newRenderEvent);
            if (onRender !== null) {
                onRender(newRenderEvent);
            }
            const { isEmpty = true } = newRenderEvent || {};
            if (isEmpty) {
                track('Empty', slot);
            } else {
                track('Render', slot, newRenderEvent);
            }
        };
        slot.on('render', onSlotRender);
        return () => slot.off('render', onSlotRender);
    }, [slot, disabled, setRenderEvent, onRender, track]);

    // Listen to destroy event
    useEffect(() => {
        if (slot === null) {
            return () => {};
        }
        const onSlotDestroy = (destroySlot) => {
            if (onDestroy !== null) {
                onDestroy(destroySlot);
            }
        };
        slot.on('destroy', onSlotDestroy);
        return () => slot.off('destroy', onSlotDestroy);
    }, [slot, onDestroy]);

    // Destroy slot
    // useEffect(
    //     () => () => {
    //         if (slot !== null) {
    //             // currentSlot.current = null;
    //             adsManager.destroySlot(slot);
    //         }
    //     },
    //     [],
    // );

    return {
        refObserver,
        slot,
        disabled: adsManager.isDisabled(),
        id: slot !== null ? slot.getElementId() : null,
        isRendered: slot !== null && slot.isRendered(),
        isEmpty: slot !== null ? slot.isEmpty() : true,
        isVisible: slot !== null ? slot.isVisible() : true,
        width: null,
        height: null,
        renderEvent,
        ...(slot !== null ? slot.getRenderedSize() : null),
    };
}

export default useAd;
