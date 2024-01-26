/* eslint-disable react/jsx-props-no-spreading */
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React, { useState, useContext, useEffect, useMemo, useRef } from 'react';

import AdsManager from './AdsManager';
import { viewports as defaultViewports, positions as defaultPositions } from './defaults';
import * as AdPropTypes from './propTypes';

const AdsContext = React.createContext(null);

export const useAdsContext = () => useContext(AdsContext);

const propTypes = {
    children: PropTypes.node.isRequired,
    defaultSlotPath: PropTypes.string,
    slotsPath: PropTypes.objectOf(PropTypes.string),
    enableSingleRequest: PropTypes.bool,
    autoInit: PropTypes.bool,
    resizeDebounceDelay: PropTypes.number,
    refreshOnResize: PropTypes.bool,
    positions: AdPropTypes.adViewports,
    viewports: AdPropTypes.adViewports,
};

const defaultProps = {
    defaultSlotPath: null,
    slotsPath: null,
    enableSingleRequest: true,
    autoInit: true,
    resizeDebounceDelay: 500,
    refreshOnResize: false,
    positions: defaultPositions,
    viewports: defaultViewports,
};

export function AdsProvider({
    children,
    defaultSlotPath,
    slotsPath,
    enableSingleRequest,
    autoInit,
    resizeDebounceDelay,
    refreshOnResize,
    viewports,
    positions,
}) {
    const [ready, setReady] = useState(false);
    const adsRef = useRef(null);
    const ads = useMemo(() => {
        if (adsRef.current === null) {
            adsRef.current = new AdsManager({
                enableSingleRequest,
                autoInit,
            });
        }
        return adsRef.current;
    }, [enableSingleRequest, autoInit]);

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
            positions,
            slotsPath:
                defaultSlotPath !== null
                    ? {
                          default: defaultSlotPath,
                          ...slotsPath,
                      }
                    : {
                          ...slotsPath,
                      },
        }),
        [ready, ads, viewports, positions, slotsPath, defaultSlotPath],
    );

    return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

AdsProvider.propTypes = propTypes;
AdsProvider.defaultProps = defaultProps;

export default AdsContext;
