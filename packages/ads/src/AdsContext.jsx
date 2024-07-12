/* eslint-disable react/jsx-props-no-spreading */
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';

import { getSizeMappingFromSlot } from './utils';

import AdsManager from './AdsManager';
import { viewports as defaultViewports, slots as defaultSlots } from './defaults';
import * as AdPropTypes from './propTypes';

const AdsContext = React.createContext({
    ready: false,
});

export const useAdsContext = () => useContext(AdsContext);

const propTypes = {
    children: PropTypes.node.isRequired,
    defaultSlotPath: PropTypes.string,
    slotsPath: PropTypes.objectOf(PropTypes.string),
    enableSingleRequest: PropTypes.bool,
    autoInit: PropTypes.bool,
    resizeDebounceDelay: PropTypes.number,
    refreshOnResize: PropTypes.bool,
    mobileScaling: PropTypes.number,
    renderMarginPercent: PropTypes.number,
    fetchMarginPercent: PropTypes.number,
    slots: AdPropTypes.adSlots,
    viewports: AdPropTypes.adViewports,
    disabled: PropTypes.bool,
    trackingDisabled: PropTypes.bool,
};

const defaultProps = {
    defaultSlotPath: null,
    slotsPath: null,
    enableSingleRequest: true,
    autoInit: true,
    resizeDebounceDelay: 500,
    refreshOnResize: false,
    mobileScaling: 1.0,
    renderMarginPercent: 100,
    fetchMarginPercent: 300,
    slots: defaultSlots,
    viewports: defaultViewports,
    disabled: false,
    trackingDisabled: false,
};

export function AdsProvider({
    children,
    defaultSlotPath,
    slotsPath,
    enableSingleRequest,
    autoInit,
    resizeDebounceDelay,
    refreshOnResize,
    mobileScaling,
    renderMarginPercent,
    fetchMarginPercent,
    viewports,
    slots,
    disabled,
    trackingDisabled,
}) {
    const [ready, setReady] = useState(false);
    const adsRef = useRef(null);
    const ads = useMemo(() => {
        if (adsRef.current === null) {
            adsRef.current = new AdsManager({
                enableSingleRequest,
                autoInit,
                disabled,
                mobileScaling,
                renderMarginPercent,
                fetchMarginPercent,
            });
        } else {
            adsRef.current.setDisabled(disabled);
        }
        return adsRef.current;
    }, [
        enableSingleRequest,
        autoInit,
        disabled,
        mobileScaling,
        renderMarginPercent,
        fetchMarginPercent,
    ]);

    useEffect(() => {
        let onReady = null;
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

    const value = useMemo(
        () => ({
            ready,
            ads,
            viewports,
            slots: Object.keys(slots || {}).reduce(
                (map, key) => ({
                    ...map,
                    [key]: {
                        ...slots[key],
                        sizeMapping: getSizeMappingFromSlot(slots[key], viewports),
                    },
                }),
                {},
            ),
            slotsPath:
                defaultSlotPath !== null
                    ? {
                          default: defaultSlotPath,
                          ...slotsPath,
                      }
                    : {
                          ...slotsPath,
                      },
            trackingDisabled,
        }),
        [ready, ads, viewports, slots, slotsPath, defaultSlotPath, trackingDisabled, disabled],
    );

    return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

AdsProvider.propTypes = propTypes;
AdsProvider.defaultProps = defaultProps;

export default AdsContext;
