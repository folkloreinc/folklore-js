import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';

const AdsTargetingContext = React.createContext(null);

export const useAdsTargeting = () => useContext(AdsTargetingContext);

const propTypes = {
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    targeting: PropTypes.object,
    replace: PropTypes.bool,
};

const defaultProps = {
    targeting: {
        domain:
            typeof window !== 'undefined'
                ? `${window.location.protocol}//${window.location.host}`
                : null,
    },
    replace: false,
};

export function AdsTargetingProvider({ children, targeting, replace }) {
    const previousTargeting = useAdsTargeting();
    const mergedTargeting = useMemo(
        () => (replace ? targeting : { ...previousTargeting, ...targeting }),
        [replace, previousTargeting, targeting],
    );
    return (
        <AdsTargetingContext.Provider value={mergedTargeting}>
            {children}
        </AdsTargetingContext.Provider>
    );
}

AdsTargetingProvider.propTypes = propTypes;
AdsTargetingProvider.defaultProps = defaultProps;

export default AdsTargetingContext;
