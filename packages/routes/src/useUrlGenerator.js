import { useCallback } from 'react';

import { useRoutesContext } from './RoutesContext';
import generatePath from './generatePath';

const useUrlGeneratorPathToRepexp = () => {
    const { routes = null, basePath = null } = useRoutesContext() || {};
    const urlGenerator = useCallback(
        (key, data, opts) => {
            const path = routes !== null ? routes[key] || null : null;
            if (path === null) {
                return null;
            }
            const url = generatePath(path, data, opts);
            return basePath !== null
                ? `${basePath.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
                : url;
        },
        [routes, basePath],
    );
    return urlGenerator;
};

export default useUrlGeneratorPathToRepexp;
