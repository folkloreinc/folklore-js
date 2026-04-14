import { useRoutesContext } from './RoutesContext';
import generatePath, { GeneratePathOpts, PathParams } from './generatePath';

export type UrlGenerator = (
    key: string,
    params?: PathParams,
    opts?: GeneratePathOpts,
) => string | null;

function useUrlGeneratorPathToRepexp(): UrlGenerator {
    'use memo';
    const { routes = null, basePath = null } = useRoutesContext() || {};
    const urlGenerator = (key, params, opts) => {
        const path = routes !== null ? routes[key] || null : null;
        if (path === null) {
            return null;
        }
        const url = generatePath(path, params, opts);
        return basePath !== null ? `${basePath.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url;
    };
    return urlGenerator;
}

export default useUrlGeneratorPathToRepexp;
