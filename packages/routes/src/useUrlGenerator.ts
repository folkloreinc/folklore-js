import { useCallback } from 'react';

import { useRoutesContext } from './RoutesContext';
import generatePath, { GeneratePathOpts, PathParams } from './generatePath';

export type UrlGenerator = (
    key: string,
    params?: PathParams,
    opts?: GeneratePathOpts,
) => string | null;

function useUrlGeneratorPathToRepexp(): UrlGenerator {
    const { routes = null, basePath = null } = useRoutesContext() || {};
    const urlGenerator = useCallback<UrlGenerator>(
        (key, params, opts) => {
            const path = routes !== null ? routes[key] || null : null;
            if (path === null) {
                return null;
            }
            const url = generatePath(path, params, opts);
            return basePath !== null
                ? `${basePath.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
                : url;
        },
        [routes, basePath],
    );
    return urlGenerator;
}

export default useUrlGeneratorPathToRepexp;
