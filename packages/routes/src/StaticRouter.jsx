import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Router, useRouter } from 'wouter';
import { navigate } from 'wouter/use-browser-location';

const propTypes = {
    location: PropTypes.string.isRequired,
    search: PropTypes.string,
    children: PropTypes.node.isRequired,
};

function StaticRouter({ location, search = null, children }) {
    const hook = useCallback(() => [location.split('?')[0], navigate], [location]);
    const searchHook = useCallback(
        () => search ?? (location.indexOf('?') !== -1 ? location.split('?')[1] : ''),
        [search, location],
    );
    const { parser } = useRouter();
    return (
        <Router parser={parser} hook={hook} searchHook={searchHook}>
            {children}
        </Router>
    );
}

StaticRouter.propTypes = propTypes;

export default StaticRouter;
