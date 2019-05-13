import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';

import StoreContext from './StoreContext';

const propTypes = {
    children: PropTypes.node,
    storeContext: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
    children: null,
    storeContext: StoreContext,
};

const RouterContainer = ({ children, storeContext, ...props }) => (
    <ConnectedRouter context={storeContext} {...props}>{children}</ConnectedRouter>
);

RouterContainer.propTypes = propTypes;
RouterContainer.defaultProps = defaultProps;

export default RouterContainer;
