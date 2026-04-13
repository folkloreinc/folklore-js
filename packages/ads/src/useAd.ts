import { useIntersectionObserver, useWindowEvent } from '@folklore/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AdSlot, { RenderEvent } from './AdSlot';
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
    onRender?: (event: RenderEvent) => void | null;
    onDestroy?: (slot: AdSlot) => void | null;
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
    'use memo';
    const {
        ads: adsManager,
        viewports,
        ready: adsReady,
        trackingDisabled: globalTrackingDisabled = false,
    } = useAdsContext();

    const trackAd = useAdsTracking();
    const track = (action: string, slot: AdSlot = null, renderEvent: RenderEvent = null) => {
        if (!disableTracking && !globalTrackingDisabled) {
            trackAd(action, slot, renderEvent);
        }
    };

    // Check for visibility
    const {
        ref: refObserver,
        entry: { isIntersecting = false },
    } = useIntersectionObserver({
        rootMargin,
        disabled,
    });

    // Window blur
    const [windowActive, setWindowActive] = useState(true); // eslint-disable-line
    const onWindowBlur = () => setWindowActive(false);
    const onWindowFocus = () => setWindowActive(true);
    useWindowEvent('blur', onWindowBlur);
    useWindowEvent('focus', onWindowFocus);

    const isVisible = isIntersecting; /* && windowActive */

    // Current render event
    const [renderEvent, setRenderEvent] = useState(null);

    const viewportSize = viewport !== null ? viewports[viewport] || null : null;
    const [, viewportFixedSize = null] =
        sizeMapping !== null && viewportSize !== null
            ? sizeMapping.find(([itViewport]) => itViewport.join('x') === viewportSize.join('x')) ||
              []
            : [];

    const adSize = viewportFixedSize || size;

    const [slot, setSlot] = useState(() =>
        path !== null && !disabled
            ? adsManager.createSlot(path, adSize, {
                  id,
                  visible: isVisible,
                  sizeMapping: viewportFixedSize === null ? sizeMapping : null,
                  targeting,
                  categoryExclusions,
              })
            : null,
    );

    if (
        slot !== null &&
        (path !== slot.getAdPath() ||
            adSize !== slot.getAdSize() ||
            id !== slot.getElementId() ||
            categoryExclusions !== slot.options.categoryExclusions ||
            sizeMapping !== slot.options.sizeMapping)
    ) {
        setSlot(
            path !== null && !disabled
                ? adsManager.createSlot(path, viewportFixedSize || size, {
                      id,
                      visible: isVisible,
                      sizeMapping: viewportFixedSize === null ? sizeMapping : null,
                      targeting,
                      categoryExclusions,
                  })
                : null,
        );
    }

    useEffect(
        () => () => {
            if (slot !== null) {
                adsManager.destroySlot(slot);
            }
        },
        [slot],
    );

    // Create slot
    const slotRef = useRef(null);
    // const { current: slot } = slotRef;
    // const [slot, setSlot] = useState(null);
    useEffect(() => {
        const newSlot =
            path !== null && !disabled
                ? adsManager.createSlot(path, adSize, {
                      id,
                      visible: isVisible,
                      sizeMapping: viewportFixedSize === null ? sizeMapping : null,
                      targeting,
                      categoryExclusions,
                  })
                : null;
        slotRef.current = newSlot;
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

    if (slot !== null && targeting !== slot.getTargeting()) {
        slot.setTargeting(targeting);
    }

    if (slot !== null && isVisible !== slot.isVisible()) {
        slot.setVisible(isVisible);
    }

    if (adsReady && slot !== null && !slot.isDefined()) {
        adsManager.defineSlot(slot);
    }

    if (adsReady && slot !== null && !slot.isDisplayed() && (alwaysRender || isVisible)) {
        adsManager.displaySlot(slot);
    }

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

    if (slot === null && renderEvent !== null) {
        setRenderEvent(null);
    }

    // Listen to display event
    useEffect(() => {
        if (slot === null) {
            return () => {};
        }
        function onSlotDisplay() {
            track('Init', slot);
        }
        slot.on('display', onSlotDisplay);
        return () => slot.off('display', onSlotDisplay);
    }, [slot]);

    // Listen to render event
    useEffect(() => {
        if (slot === null) {
            return () => {};
        }
        function onSlotRender({ event }: { event: googletag.events.SlotRenderEndedEvent }) {
            const newRenderEvent: RenderEvent = {
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
        }
        slot.on('render', onSlotRender);
        return () => slot.off('render', onSlotRender);
    }, [slot, disabled, setRenderEvent, onRender, track]);

    // Listen to destroy event
    useEffect(() => {
        if (slot === null) {
            return () => {};
        }
        function onSlotDestroy(destroySlot: AdSlot) {
            if (onDestroy !== null) {
                onDestroy(destroySlot);
            }
        }
        slot.on('destroy', onSlotDestroy);
        return () => slot.off('destroy', onSlotDestroy);
    }, [slot, onDestroy]);

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
