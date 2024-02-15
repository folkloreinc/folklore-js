import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

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

    // Create ad
    const {
        disabled: adsDisabled,
        id,
        width,
        height,
        isEmpty,
        refObserver,
        slot: slotObject = null,
    } = useAd(finalPath, finalSize, {
        sizeMapping: finalSizeMapping,
        targeting: finalAdTargeting.targeting,
        refreshInterval: finalAdTargeting.refreshInterval,
        alwaysRender,
        onRender,
        disabled,
    });

    if (slotRef !== null && isFunction(slotRef)) {
        slotRef(slotObject);
    } else if (slotRef !== null && isObject(slotRef)) {
        // eslint-disable-next-line no-param-reassign
        slotRef.current = slotObject;
    }

    // Get size

    if (id === null) {
        return null;
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
            style={
                adsDisabled
                    ? {
                          display: 'none',
                          visibility: 'hidden',
                      }
                    : null
            }
            ref={refObserver}
        >
            <div
                className={adClassName}
                style={{
                    width,
                    height,
                }}
            >
                <div id={id} />
            </div>
        </div>
    );
}

Ad.propTypes = propTypes;
Ad.defaultProps = defaultProps;

export default Ad;
