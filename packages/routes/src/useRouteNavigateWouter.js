import { useCallback } from 'react';
import { useLocation } from 'wouter';

import useUrlGeneratorPathToRegexp from './useUrlGeneratorPathToRegexp';

const useRouteNavigate = () => {
    const url = useUrlGeneratorPathToRegexp();
    const [setLocation] = useLocation();
    const routeNavigate = useCallback(
        (route, data, ...args) => setLocation(url(route, data), ...args),
        [setLocation, url],
    );
    return routeNavigate;
};

export default useRouteNavigate;
