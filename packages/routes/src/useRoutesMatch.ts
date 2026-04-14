import { useLocation, useRouter } from 'wouter';

import useRoutes from './useRoutes';

export default function useRoutesMatch(routes: string[], specificLocation?: string): boolean {
    'use memo';
    const router = useRouter();
    const allRoutes = useRoutes();
    const [location] = useLocation();
    const patterns = routes
        .map((route) => allRoutes[route] || route)
        .map((route) => {
            const { pattern = null } = router.parser(route || '*');
            return pattern;
        })
        .filter((it) => it !== null);
    const finalLocation = specificLocation || location;
    return patterns.reduce(
        (isMatching, pattern) => isMatching || pattern.exec(finalLocation) !== null,
        false,
    );
}
