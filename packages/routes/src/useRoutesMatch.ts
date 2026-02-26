import { useMemo } from 'react';
import { useLocation } from 'wouter';

import useRouteMatcher from './useRouteMatcher';

export default function useRoutesMatch(
    routes: string[],
    specificLocation?: string | null,
): boolean {
    const routeMatcher = useRouteMatcher();
    const [location] = useLocation();
    return useMemo(
        () =>
            routes.reduce((isMatching, route) => {
                if (isMatching) {
                    return true;
                }
                const [match = false] = routeMatcher(route, specificLocation || location);
                return match;
            }, false),
        [...routes, routeMatcher, specificLocation, location],
    );
}
