import { useLocation } from 'wouter';

import useUrlGeneratorPathToRegexp from './useUrlGenerator';

const useRouteNavigate = () => {
    'use memo';
    const url = useUrlGeneratorPathToRegexp();
    const [, setLocation] = useLocation();
    const routeNavigate = (route: string, data?: Record<string, unknown>, ...args: unknown[]) =>
        setLocation(url(route, data), ...args.slice(0, 1));
    return routeNavigate;
};

export default useRouteNavigate;
