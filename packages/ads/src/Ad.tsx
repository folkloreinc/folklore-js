/* eslint-disable react/require-default-props */
import classNames from 'classnames';
import { Ref, useCallback, useId, useMemo, useRef, useState } from 'react';

import { getMinimumAdSize, getSizeFromSizeMapping, normalizeAdSizes } from './utils';

import AdSlot from './AdSlot';
import { useAdsContext } from './AdsContext';
import { useAdsTargeting } from './AdsTargetingContext';
import RichAd from './RichAd';
import { AdSize, AdSizeMapping, AdsTargeting } from './types';
import useAd from './useAd';
import useRichAd from './useRichAd';

export interface AdProps {
    slot: string;
    path?: string | null;
    size?: AdSize[] | null;
    sizeMapping?: AdSizeMapping[] | null;
    viewport?: string | null;
    targeting?: AdsTargeting | null;
    refreshInterval?: number | null;
    alwaysRender?: boolean;
    disabled?: boolean;
    disableTracking?: boolean;
    shouldKeepSize?: boolean;
    withoutStyle?: boolean;
    withoutMinimumSize?: boolean;
    withReactId?: boolean;
    className?: string | null;
    emptyClassName?: string | null;
    adClassName?: string | null;
    richAdClassName?: string | null;
    richAdIframeClassName?: string | null;
    onRender?: ((event: any) => void) | null;
    onDestroy?: (() => void) | null;
    onRichAd?: ((richAd: any) => void) | null;
    slotRef?: Ref<AdSlot> | null;
}

function Ad({
    slot: slotName,
    path: providedPath = null,
    size: providedSize = null,
    sizeMapping: providedSizeMapping = null,
    viewport: providedViewport = null,
    targeting: providedTargeting = null,
    refreshInterval: providedRefreshInterval = null,
    alwaysRender = true,
    disabled: providedDisabled = false,
    disableTracking = false,
    shouldKeepSize = false,
    withoutStyle = false,
    withoutMinimumSize = false,
    withReactId = false,
    className = null,
    emptyClassName = null,
    adClassName = null,
    richAdClassName = null,
    richAdIframeClassName = null,
    onRender = null,
    onDestroy = null,
    onRichAd = null,
    slotRef = null,
}: AdProps) {
    const {
        slots = null,
        slotsPath = null,
        viewport: contextViewport = null,
        ads,
    } = useAdsContext();
    const { default: defaultSlotPath = null } = slotsPath || {};
    const slot = slotName && slots !== null ? slots[slotName] || null : null;
    const {
        sizeMapping: slotSizeMapping = null,
        size: slotSize = null,
        path: slotPath = null,
    } = slot || {};
    const path =
        providedPath ||
        slotPath ||
        (slotName !== null && slotsPath !== null ? slotsPath[slotName] : null) ||
        defaultSlotPath ||
        null;

    // Size
    const size = providedSize || slotSize;
    const sizeMapping = providedSizeMapping || slotSizeMapping;
    const minimumSize = useMemo(
        () =>
            getMinimumAdSize([
                ...(getSizeFromSizeMapping(sizeMapping) || []),
                ...normalizeAdSizes(size),
            ]),
        [sizeMapping, size],
    );

    // Targeting
    const contextTargeting = useAdsTargeting();
    const { targeting, refreshInterval, disabled, viewport } = useMemo(() => {
        const allTargeting = {
            ...(slotName !== null ? { slot: slotName } : null),
            ...contextTargeting,
            ...providedTargeting,
        };
        const {
            refreshAds = null,
            disabled: targetingDisabled = false,
            viewport: targetingViewport = null,
            ...otherProps
        } = allTargeting || {};
        return {
            refreshInterval:
                refreshAds !== null && refreshAds === 'inactive' ? null : providedRefreshInterval,
            disabled: providedDisabled || targetingDisabled || ads.isDisabled(),
            viewport: providedViewport || contextViewport || targetingViewport,
            targeting: otherProps || {},
        };
    }, [
        slotName,
        contextTargeting,
        providedTargeting,
        ads,
        providedRefreshInterval,
        providedDisabled,
        providedViewport,
        contextViewport,
    ]);

    const [lastRenderedSize, setLastRenderedSize] = useState<{
        width: number;
        height: number;
    } | null>(null);
    const onAdRender = useCallback(
        (event: any) => {
            const { isEmpty: newIsEmpty = true, width: newWidth, height: newHeight } = event || {};
            const isRendered = !newIsEmpty;

            setLastRenderedSize(
                isRendered
                    ? {
                          width: newWidth,
                          height: newHeight,
                      }
                    : null,
            );

            if (onRender !== null) {
                onRender(event);
            }
        },
        [onRender, shouldKeepSize, disabled],
    );

    // useEffect(() => {
    //     if (!disabled) {
    //         return;
    //     }
    //     const keepSize = shouldKeepSize && lastRenderedSize.current !== null;
    //     if (onRender !== null) {
    //         onRender({
    //             isEmpty: true,
    //             keepSize,
    //         });
    //     }
    // }, [disabled]);

    const reactId = useId();

    // Create ad
    const {
        id,
        width,
        height,
        isFluid = false,
        isEmpty,
        isRendered,
        refObserver,
        slot: slotObject = null,
    } = useAd(path, size, {
        id: withReactId ? `ad-${reactId}` : null,
        viewport,
        sizeMapping,
        targeting,
        refreshInterval,
        alwaysRender,
        onRender: onAdRender,
        onDestroy,
        disabled,
        disableTracking,
    });

    const adContainerRef = useRef(null);
    const richAd = useRichAd(adContainerRef, id, {
        onRichAd,
    });

    if (slotRef !== null && typeof slotRef === 'function') {
        slotRef(slotObject);
    } else if (slotRef !== null && typeof slotRef === 'object') {
        // eslint-disable-next-line no-param-reassign
        slotRef.current = slotObject;
    }

    const keepSize = shouldKeepSize && lastRenderedSize !== null && !isRendered;

    if (id === null && !keepSize) {
        return null;
    }

    let adStyle = null;
    if (isRendered) {
        adStyle = !isFluid
            ? {
                  width,
                  height,
              }
            : null;
    } else if (keepSize) {
        adStyle = lastRenderedSize;
    } else if (!withoutMinimumSize) {
        adStyle = minimumSize;
    }

    let containerStyle = null;
    if (disabled && !keepSize) {
        containerStyle = {
            display: 'none',
            visibility: 'hidden',
        };
    } else if (isEmpty && !keepSize) {
        containerStyle = {
            height: 0,
            paddingBottom: 0,
            overflow: 'hidden',
            opacity: 0,
        };
    }

    return (
        <div
            id={id !== null ? `${id}-container` : null}
            className={classNames([
                className,
                {
                    [emptyClassName]: emptyClassName !== null && isEmpty && !keepSize,
                },
            ])}
            style={!withoutStyle ? containerStyle : null}
            suppressHydrationWarning={true}
            ref={refObserver}
        >
            <div
                className={adClassName}
                style={{
                    position: 'relative',
                    ...adStyle,
                }}
                ref={adContainerRef}
                suppressHydrationWarning={true}
            >
                <div
                    id={id}
                    className={classNames([
                        {
                            [richAdIframeClassName]:
                                richAdIframeClassName !== null && isRendered && richAd !== null,
                        },
                    ])}
                    suppressHydrationWarning={true}
                />
                {isRendered && richAd !== null ? (
                    <RichAd
                        richAd={richAd}
                        isFluid={isFluid}
                        width={width}
                        height={height}
                        className={richAdClassName}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default Ad;
