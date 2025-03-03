import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Router, useRouter } from 'wouter';
import { navigate } from 'wouter/use-browser-location';

const propTypes = {
    location: PropTypes.string.isRequired,
    children: PropTypes.node,
};

const defaultProps = {
    children: null,
};

function StaticRouter({ location, children }) {
    const hook = useCallback(() => [location.split('?')[0], navigate], [location]);
    const searchHook = useCallback(
        () => (location.indexOf('?') !== -1 ? location.split('?')[1] : ''),
        [location],
    );
    const { parser } = useRouter();
    return (
        <Router parser={parser} hook={hook} searchHook={searchHook}>
            {children}
        </Router>
    );
}

StaticRouter.propTypes = propTypes;
StaticRouter.defaultProps = defaultProps;

export default StaticRouter;
