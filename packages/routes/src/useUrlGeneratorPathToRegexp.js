import { compile } from 'path-to-regexp';
import { useCallback } from 'react';

import { useRoutesContext } from './RoutesContext';

const compilers = {};

const useUrlGeneratorPathToRepexp = () => {
    const { routes, basePath } = useRoutesContext();
    const urlGenerator = useCallback(
        (key, data) => {
            const finalKey = key;
            const path = routes[finalKey];
            if (typeof compilers[path] === 'undefined') {
                compilers[path] = compile(path, { encode: encodeURIComponent });
            }
            const compiler = compilers[path];
            const url = compiler(data);

            return basePath !== null
                ? `${basePath.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
                : url;
        },
        [routes, basePath],
    );
    return urlGenerator;
};

export default useUrlGeneratorPathToRepexp;
