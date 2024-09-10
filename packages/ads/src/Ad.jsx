import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { getMinimumAdSize } from './utils';

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
    targeting: AppPropTypes.adTargeting,
    refreshInterval: PropTypes.number,
    alwaysRender: PropTypes.bool,
    disabled: PropTypes.bool,
    disableTracking: PropTypes.bool,
    shouldKeepSize: PropTypes.bool,
    withoutStyle: PropTypes.bool,
    withoutMinimumSize: PropTypes.bool,
    className: PropTypes.string,
    emptyClassName: PropTypes.string,
    adClassName: PropTypes.string,
    richAdClassName: PropTypes.string,
    richAdIframeClassName: PropTypes.string,
    onRender: PropTypes.func,
    onDestroy: PropTypes.func,
    slotRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

const defaultProps = {
    path: null,
    size: null,
    sizeMapping: null,
    targeting: null,
    refreshInterval: null,
    alwaysRender: true,
    disabled: false,
    disableTracking: false,
    shouldKeepSize: false,
    withoutStyle: false,
    withoutMinimumSize: false,
    className: null,
    emptyClassName: null,
    adClassName: null,
    richAdClassName: null,
    richAdIframeClassName: null,
    onRender: null,
    onDestroy: null,
    slotRef: null,
};

function Ad({
    slot: slotName,
    path,
    size,
    sizeMapping,
    targeting,
    refreshInterval,
    alwaysRender,
    disabled,
    disableTracking,
    shouldKeepSize,
    withoutStyle,
    withoutMinimumSize,
    className,
    emptyClassName,
    adClassName,
    richAdClassName,
    richAdIframeClassName,
    onRender,
    onDestroy,
    slotRef,
}) {
    const { slots = null, slotsPath = {} } = useAdsContext();
    const slot = slotName !== null && slots !== null ? slots[slotName] || null : null;
    const finalPath =
        path ||
        (slot !== null ? slot.path || null : null) ||
        (slotName !== null ? slotsPath[slotName] : null) ||
        slotsPath.default ||
        null;
    const finalSize = size || (slot !== null ? slot.size || null : null);
    const finalSizeMapping = sizeMapping || (slot !== null ? slot.sizeMapping || null : null);
    const minimumSize = useMemo(
        () =>
            getMinimumAdSize(
                finalSizeMapping !== null
                    ? finalSizeMapping.reduce(
                          (allSizes, sizeMap) => [...allSizes, sizeMap[1]],
                          [finalSize],
                      )
                    : finalSize,
            ),
        [finalSizeMapping, finalSize],
    );

    // Targeting
    const contextTargeting = useAdsTargeting();
    const { disabled: targetingDisabled = false } = contextTargeting || {};
    const finalDisabled = disabled || targetingDisabled;

    const allTargeting = useMemo(() => {
        const { disabled: removedDisabled, ...otherTargeting } = contextTargeting || {};
        return {
            ...(slotName !== null ? { slot: slotName } : null),
            ...otherTargeting,
            ...targeting,
        };
    }, [contextTargeting, targeting, slotName]);

    const finalAdTargeting = useMemo(() => {
        const { refreshAds = null, ...otherProps } = allTargeting || {};
        return {
            refreshInterval:
                refreshAds !== null && refreshAds === 'inactive' ? null : refreshInterval,
            targeting: otherProps || {},
        };
    }, [allTargeting, refreshInterval]);

    const lastRenderedSize = useRef(null);
    const wasDisabled = useRef(finalDisabled);
    const onAdRender = useCallback(
        (event) => {
            const { isEmpty: newIsEmpty = true, width: newWidth, height: newHeight } = event || {};

            if (finalDisabled) {
                wasDisabled.current = true;
            } else if (!finalDisabled && !newIsEmpty) {
                wasDisabled.current = false;
            }

            lastRenderedSize.current = !newIsEmpty
                ? {
                      width: newWidth,
                      height: newHeight,
                  }
                : null;

            if (onRender !== null) {
                onRender(event);
            }
        },
        [onRender, shouldKeepSize, finalDisabled],
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

    // Create ad
    const {
        disabled: adsDisabled,
        id,
        width,
        height,
        isFluid = false,
        isEmpty,
        isRendered,
        refObserver,
        slot: slotObject = null,
    } = useAd(finalPath, finalSize, {
        sizeMapping: finalSizeMapping,
        targeting: finalAdTargeting.targeting,
        refreshInterval: finalAdTargeting.refreshInterval,
        alwaysRender,
        onRender: onAdRender,
        onDestroy,
        disabled: finalDisabled,
        disableTracking,
    });

    const adContainerRef = useRef(null);
    const richAd = useRichAd(adContainerRef, id);

    if (slotRef !== null && isFunction(slotRef)) {
        slotRef(slotObject);
    } else if (slotRef !== null && isObject(slotRef)) {
        // eslint-disable-next-line no-param-reassign
        slotRef.current = slotObject;
    }

    if (finalDisabled) {
        wasDisabled.current = true;
    } else if (!finalDisabled && isRendered) {
        wasDisabled.current = false;
    }

    const waitingNextRender = wasDisabled.current && !isRendered;
    const keepSize =
        shouldKeepSize && (finalDisabled || waitingNextRender) && lastRenderedSize.current !== null;

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
    } else if (shouldKeepSize && (finalDisabled || waitingNextRender)) {
        adStyle = lastRenderedSize.current;
    } else if (!withoutMinimumSize) {
        adStyle = minimumSize;
    }

    let containerStyle = null;
    if (adsDisabled) {
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
                    [emptyClassName]: emptyClassName !== null && isEmpty,
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
Ad.defaultProps = defaultProps;

export default Ad;
