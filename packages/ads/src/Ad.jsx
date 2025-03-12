/* eslint-disable react/require-default-props */
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { getMinimumAdSize, getSizeFromSizeMapping, normalizeAdSizes } from './utils';

import { useAdsContext } from './AdsContext';
import { useAdsTargeting } from './AdsTargetingContext';
import RichAd from './RichAd';
import * as AppPropTypes from './propTypes';
import useAd from './useAd';
import useRichAd from './useRichAd';

const propTypes = {
    slot: PropTypes.string.isRequired,
    path: AppPropTypes.adPath,
    size: AppPropTypes.adSize,
    sizeMapping: AppPropTypes.adSizeMapping,
    viewport: PropTypes.string,
    targeting: AppPropTypes.adTargeting,
    refreshInterval: PropTypes.number,
    alwaysRender: PropTypes.bool,
    disabled: PropTypes.bool,
    disableTracking: PropTypes.bool,
    shouldKeepSize: PropTypes.bool,
    withoutStyle: PropTypes.bool,
    withoutMinimumSize: PropTypes.bool,
    withReactId: PropTypes.bool,
    className: PropTypes.string,
    emptyClassName: PropTypes.string,
    adClassName: PropTypes.string,
    richAdClassName: PropTypes.string,
    richAdIframeClassName: PropTypes.string,
    onRender: PropTypes.func,
    onDestroy: PropTypes.func,
    onRichAd: PropTypes.func,
    slotRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

function Ad({
    slot: slotName = null,
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
}) {
    const {
        slots = null,
        slotsPath = null,
        viewport: contextViewport = null,
        ads,
    } = useAdsContext();
    const { default: defaultSlotPath = null } = slotsPath || {};
    const slot = slotName !== null && slots !== null ? slots[slotName] || null : null;
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

    const [lastRenderedSize, setLastRenderedSize] = useState(null);
    const onAdRender = useCallback(
        (event) => {
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

    if (slotRef !== null && isFunction(slotRef)) {
        slotRef(slotObject);
    } else if (slotRef !== null && isObject(slotRef)) {
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
            ref={refObserver}
        >
            <div
                className={adClassName}
                style={{
                    position: 'relative',
                    ...adStyle,
                }}
                ref={adContainerRef}
            >
                <div
                    id={id}
                    className={classNames([
                        {
                            [richAdIframeClassName]:
                                richAdIframeClassName !== null && isRendered && richAd !== null,
                        },
                    ])}
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

Ad.propTypes = propTypes;

export default Ad;
