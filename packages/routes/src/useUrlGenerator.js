import { useCallback } from 'react';
import { generatePath } from 'react-router';

import { useRoutesContext } from './RoutesContext';

const useUrlGenerator = () => {
    const { routes, basePath } = useRoutesContext();
    const urlGenerator = useCallback(
        (key, data) => {
            const finalKey = key;
            const url = generatePath(routes[finalKey], data);

            return basePath !== null
                ? `${basePath.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
                : url;
        },
        [routes, basePath],
    );
    return urlGenerator;
};

export default useUrlGenerator;
