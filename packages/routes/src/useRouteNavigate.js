import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import useUrlGenerator from './useUrlGenerator';

const useRouteNavigate = () => {
    const url = useUrlGenerator();
    const navigate = useNavigate();
    const routeNavigate = useCallback((route, data, ...args) => navigate(url(route, data), ...args), [
        navigate,
        url,
    ]);
    return routeNavigate;
};

export default useRouteNavigate;
