import { useCallback } from 'react';
import { useLocation } from 'wouter';

import useUrlGeneratorPathToRegexp from './useUrlGenerator';

const useRouteNavigate = () => {
    const url = useUrlGeneratorPathToRegexp();
    const [, setLocation] = useLocation();
    const routeNavigate = useCallback(
        (route: string, data?: Record<string, unknown>, ...args: unknown[]) =>
            setLocation(url(route, data), ...args.slice(0, 1)),
        [setLocation, url],
    );
    return routeNavigate;
};

export default useRouteNavigate;
