/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
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

export const RoutesProvider = ({ routes, basePath, children }) => (
    <RoutesContext.Provider value={{ routes, basePath }}>{children}</RoutesContext.Provider>
);

RoutesProvider.propTypes = propTypes;
RoutesProvider.defaultProps = defaultProps;

export default RoutesContext;
