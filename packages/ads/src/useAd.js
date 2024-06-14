import { useIntersectionObserver, useWindowEvent } from '@folklore/hooks';
import { useMemo, useEffect, useState, useRef, useCallback } from 'react';

import { useAdsContext } from './AdsContext';
import useAdsTracking from './useAdsTracking';

function useAd(
    path,
    size,
    {
        sizeMapping = null,
        targeting = null,
        categoryExclusions = null,
        refreshInterval = null,
        alwaysRender = false,
        onRender = null,
        disabled = false,
        trackingDisabled = false,
        rootMargin = '300px',
    } = {},
) {
    const {
        ads: adsManager,
        ready: adsReady,
        trackingDisabled: globalTrackingDisabled = false,
    } = useAdsContext();

    const trackAd = useAdsTracking();
    const track = useCallback(
        (...args) => {
            if (!trackingDisabled && !globalTrackingDisabled) {
                trackAd(...args);
            }
        },
        [trackingDisabled, globalTrackingDisabled, trackAd],
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
    const currentSlot = useRef(null);
    const slot = useMemo(() => {
        if (currentSlot.current !== null) {
            adsManager.destroySlot(currentSlot.current);
            currentSlot.current = null;
        }
        currentSlot.current =
            path !== null && !disabled
                ? adsManager.createSlot(path, size, {
                      visible: isVisible,
                      sizeMapping,
                      targeting,
                      categoryExclusions,
                  })
                : null;
        // if (currentSlot.current !== null && adsReady) {
        //     adsManager.defineSlot(currentSlot.current);
        // }
        return currentSlot.current;
    }, [
        adsManager,
        path,
        disabled,
        size,
        sizeMapping,
        targeting,
        alwaysRender,
        categoryExclusions,
    ]);

    // Set visibility
    useEffect(() => {
        if (slot !== null) {
            slot.setVisible(isVisible);
        }
    }, [slot, isVisible]);

    // Render ad when visible
    useEffect(() => {
        const slotReady = slot !== null && !slot.isDefined();
        if (adsReady && slotReady && (alwaysRender || isVisible)) {
            adsManager.defineSlot(slot);
            adsManager.displaySlot(slot);
            track('Init', slot);
        }
    }, [adsManager, adsReady, slot, alwaysRender, isIntersecting, track]);

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

    // Destroy slot
    useEffect(
        () => () => {
            if (slot !== null) {
                currentSlot.current = null;
                adsManager.destroySlot(slot);
            }
        },
        [],
    );

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
