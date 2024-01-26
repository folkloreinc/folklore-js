import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo, useRef } from 'react';

import { getMinimumAdSize, getSizeMappingFromPosition } from './utils';

import { useAdsContext } from './AdsContext';
import { useAdsTargeting } from './AdsTargetingContext';
import * as AppPropTypes from './propTypes';
import useAd from './useAd';

const propTypes = {
    position: PropTypes.string.isRequired,
    slot: PropTypes.string,
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
};

const defaultProps = {
    path: null,
    slot: 'default',
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
};

function Ad({
    position: positionName,
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
}) {
    const { viewports, positions, slotsPath } = useAdsContext();
    const position = positionName !== null ? positions[positionName] || null : null;
    const finalPath =
        path ||
        (slotName !== null ? slotsPath[slotName] : null) ||
        (positionName !== null ? slotsPath[positionName] : null);
    const finalSize = size !== null ? size : position.size;

    // Targeting
    const contextTargeting = useAdsTargeting();
    const finalSizeMapping = useMemo(
        () =>
            sizeMapping !== null ? sizeMapping : getSizeMappingFromPosition(position, viewports),
        [sizeMapping, position, viewports],
    );

    const allTargeting = useMemo(
        () =>
            contextTargeting !== null || targeting !== null || positionName !== null
                ? {
                      position: positionName,
                      ...contextTargeting,
                      ...targeting,
                  }
                : null,
        [contextTargeting, targeting, positionName],
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
        isRendered,
        refObserver,
    } = useAd(finalPath, finalSize, {
        sizeMapping: finalSizeMapping,
        targeting: finalAdTargeting.targeting,
        refreshInterval: finalAdTargeting.refreshInterval,
        alwaysRender,
        onRender,
        disabled,
    });

    // Get size
    const lastRenderedSize = useRef(null);
    const wasDisabled = useRef(disabled);
    const waitingNextRender = useMemo(() => {
        if (disabled) {
            wasDisabled.current = true;
        } else if (!disabled && isRendered) {
            wasDisabled.current = false;
        }
        return wasDisabled.current && !isRendered;
    }, [isRendered]);
    const sizeStyle = useMemo(() => {
        if (disabled || waitingNextRender) {
            return lastRenderedSize.current;
        }
        const { width: minimumWidth, height: minimumHeight } = getMinimumAdSize(
            finalSizeMapping !== null
                ? finalSizeMapping.reduce(
                      (allSizes, sizeMap) => [...allSizes, sizeMap[1]],
                      [finalSize],
                  )
                : finalSize,
        );
        if (isRendered) {
            lastRenderedSize.current = !isEmpty
                ? {
                      width,
                      height,
                  }
                : null;
        }
        return {
            width: isRendered ? width : minimumWidth,
            height: isRendered ? height : minimumHeight,
        };
    }, [id, disabled, finalSize, finalSizeMapping, width, height, isRendered, isEmpty]);
    const keepSize = (disabled || waitingNextRender) && lastRenderedSize.current !== null;

    if (id === null && !keepSize) {
        return null;
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
            ref={refObserver}
            style={
                isEmpty && !keepSize
                    ? {
                          height: 0,
                          paddingBottom: 0,
                          overflow: 'hidden',
                          opacity: 0,
                      }
                    : null
            }
        >
            <div
                className={adClassName}
                style={{
                    ...sizeStyle,
                    margin: 'auto',
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
