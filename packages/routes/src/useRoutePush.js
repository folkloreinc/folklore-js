import { useCallback } from 'react';
import { useHistory } from 'react-router';

import useUrlGenerator from './useUrlGenerator';

const useRoutePush = () => {
    const url = useUrlGenerator();
    const history = useHistory();
    const push = useCallback((route, data, ...args) => history.push(url(route, data), ...args), [
        history,
        url,
    ]);
    return push;
};

export default useRoutePush;
