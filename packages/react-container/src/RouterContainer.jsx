import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';

const propTypes = {
    history: PropTypes.shape({}),
    children: PropTypes.node,
};

const defaultProps = {
    history: null,
    children: null,
};

const RouterContainer = ({ history, children }) => (
    <ConnectedRouter history={history}>{children}</ConnectedRouter>
);

RouterContainer.propTypes = propTypes;
RouterContainer.defaultProps = defaultProps;

export default RouterContainer;
