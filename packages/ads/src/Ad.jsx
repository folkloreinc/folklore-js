import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef } from 'react';

import { getMinimumAdSize } from './utils';

import { useAdsContext } from './AdsContext';
import { useAdsTargeting } from './AdsTargetingContext';
import * as AppPropTypes from './propTypes';
import useAd from './useAd';

const propTypes = {
    slot: PropTypes.string.isRequired,
    path: AppPropTypes.adPath,
    size: AppPropTypes.adSize,
    sizeMapping: AppPropTypes.adSizeMapping,
    targeting: AppPropTypes.adTargeting,
    refreshInterval: PropTypes.number,
    alwaysRender: PropTypes.bool,
    disabled: PropTypes.bool,
    shouldKeepSize: PropTypes.bool,
    withoutStyle: PropTypes.bool,
    withoutMinimumSize: PropTypes.bool,
    className: PropTypes.string,
    emptyClassName: PropTypes.string,
    adClassName: PropTypes.string,
    onRender: PropTypes.func,
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
    shouldKeepSize: false,
    withoutStyle: false,
    withoutMinimumSize: false,
    className: null,
    emptyClassName: null,
    adClassName: null,
    onRender: null,
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
    shouldKeepSize,
    withoutStyle,
    withoutMinimumSize,
    className,
    emptyClassName,
    adClassName,
    onRender,
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

    const allTargeting = useMemo(
        () =>
            contextTargeting !== null || targeting !== null || slotName !== null
                ? {
                      slot: slotName,
                      ...contextTargeting,
                      ...targeting,
                  }
                : null,
        [contextTargeting, targeting, slotName],
    );

    const finalAdTargeting = useMemo(() => {
        const { refreshAds = null, ...otherProps } = allTargeting || {};
        return {
            refreshInterval:
                refreshAds !== null && refreshAds === 'inactive' ? null : refreshInterval,
            targeting: otherProps || {},
        };
    }, [allTargeting, refreshInterval]);

    const lastRenderedSize = useRef(null);
    const wasDisabled = useRef(disabled);
    const onAdRender = useCallback(
        (event) => {
            const { isEmpty: newIsEmpty = true } = event || {};
            const newIsRendered = !newIsEmpty;

            if (disabled) {
                wasDisabled.current = true;
            } else if (!disabled && newIsRendered) {
                wasDisabled.current = false;
            }

            const waitingNextRender = wasDisabled.current && !newIsRendered;
            const keepSize =
                shouldKeepSize &&
                (disabled || waitingNextRender) &&
                lastRenderedSize.current !== null;

            if (onRender !== null) {
                onRender({
                    ...event,
                    keepSize,
                });
            }
        },
        [onRender, shouldKeepSize, disabled],
    );

    // Create ad
    const {
        disabled: adsDisabled,
        id,
        width,
        height,
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
        disabled,
    });

    if (slotRef !== null && isFunction(slotRef)) {
        slotRef(slotObject);
    } else if (slotRef !== null && isObject(slotRef)) {
        // eslint-disable-next-line no-param-reassign
        slotRef.current = slotObject;
    }

    if (isRendered) {
        lastRenderedSize.current = {
            width,
            height,
        };
    }

    if (disabled) {
        wasDisabled.current = true;
    } else if (!disabled && isRendered) {
        wasDisabled.current = false;
    }

    const waitingNextRender = wasDisabled.current && !isRendered;
    const keepSize =
        shouldKeepSize && (disabled || waitingNextRender) && lastRenderedSize.current !== null;

    if (id === null) {
        return null;
    }

    let adStyle = null;
    if (isRendered) {
        adStyle = {
            width,
            height,
        };
    } else if (shouldKeepSize && (disabled || waitingNextRender)) {
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
            <div className={adClassName} style={adStyle}>
                <div id={id} />
            </div>
        </div>
    );
}

Ad.propTypes = propTypes;
Ad.defaultProps = defaultProps;

export default Ad;
