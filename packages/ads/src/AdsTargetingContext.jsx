import PropTypes from 'prop-types';
import React, { useContext } from 'react';

const AdsTargetingContext = React.createContext(null);

export const useAdsTargeting = () => useContext(AdsTargetingContext);

const propTypes = {
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    targeting: PropTypes.object,
};

const defaultProps = {
    targeting: {
        domain:
            typeof window !== 'undefined'
                ? `${window.location.protocol}//${window.location.host}`
                : null,
    },
};

export function AdsTargetingProvider({ children, targeting }) {
    return (
        <AdsTargetingContext.Provider value={targeting}>{children}</AdsTargetingContext.Provider>
    );
}

AdsTargetingProvider.propTypes = propTypes;
AdsTargetingProvider.defaultProps = defaultProps;

export default AdsTargetingContext;
