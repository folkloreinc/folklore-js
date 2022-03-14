/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

export const RoutesContext = React.createContext(null);

export const useRoutesContext = () => useContext(RoutesContext);

const propTypes = {
    children: PropTypes.node.isRequired,
    routes: PropTypes.objectOf(PropTypes.string).isRequired,
    basePath: PropTypes.string,
};

const defaultProps = {
    basePath: null,
};

export function RoutesProvider({ routes, basePath, children }) {
    const value = useMemo(
        () => ({
            routes,
            basePath,
        }),
        [routes, basePath],
    );
    return <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>;
}

RoutesProvider.propTypes = propTypes;
RoutesProvider.defaultProps = defaultProps;

export default RoutesContext;
