import mitt from 'mitt';
import { useState, useSyncExternalStore } from 'react';

import parseLocation from './parseLocation';

type UseMemoryRouterOptions = {
    path?: string;
    static?: boolean;
    record?: boolean;
};

type NavigateOptions = {
    replace?: boolean;
};

type NavigateFn = (newPath: string, opts?: NavigateOptions) => void;

export default function useMemoryRouter({
    path = '/',
    static: staticLocation = false,
    record = true,
}: UseMemoryRouterOptions = {}) {
    'use memo';
    const [currentPath, setCurrentPath] = useState(() => parseLocation(path));
    const [history, setHistory] = useState([currentPath]);
    const emitter = mitt<{ navigate: string }>();

    const navigateImplementation: NavigateFn = (newPath, { replace = false } = {}) => {
        const newParsedPath = parseLocation(newPath);
        if (record) {
            if (replace) {
                setHistory([...history].splice(history.length - 1, 1, newParsedPath));
            } else {
                setHistory([...history, newParsedPath]);
            }
        }

        setCurrentPath(newParsedPath);
        emitter.emit('navigate', path);
    };

    const navigate: NavigateFn = !staticLocation ? navigateImplementation : () => {};

    const subscribe = (cb: () => void) => {
        emitter.on('navigate', cb);
        return () => emitter.off('navigate', cb);
    };

    function reset() {
        // clean history array with mutation to preserve link
        setHistory([...history].splice(0, history.length));

        navigateImplementation(path);
    }

    const locationStore = useSyncExternalStore(subscribe, () => currentPath.pathname);
    const searchStore = useSyncExternalStore(subscribe, () => currentPath.search || '');
    const locationHook = (): [string, NavigateFn] => [locationStore, navigate];
    const searchHook = (): string => searchStore;

    return {
        hook: locationHook,
        searchHook,
        reset,
        navigate,
    };
}
