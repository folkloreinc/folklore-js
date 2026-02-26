import mitt from 'mitt';
import { useSyncExternalStore } from 'react';

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
    let currentPath = parseLocation(path);
    const history = [currentPath];
    const emitter = mitt<{ navigate: string }>();

    const navigateImplementation: NavigateFn = (newPath, { replace = false } = {}) => {
        const newParsedPath = parseLocation(newPath);
        if (record) {
            if (replace) {
                history.splice(history.length - 1, 1, newParsedPath);
            } else {
                history.push(newParsedPath);
            }
        }

        currentPath = newParsedPath;
        emitter.emit('navigate', path);
    };

    const navigate: NavigateFn = !staticLocation ? navigateImplementation : () => {};

    const subscribe = (cb: () => void) => {
        emitter.on('navigate', cb);
        return () => emitter.off('navigate', cb);
    };

    function reset() {
        // clean history array with mutation to preserve link
        history.splice(0, history.length);

        navigateImplementation(path);
    }

    const locationHook = (): [string, NavigateFn] => [
        useSyncExternalStore(subscribe, () => currentPath.pathname),
        navigate,
    ];
    const searchHook = (): string =>
        useSyncExternalStore(subscribe, () => currentPath.search || '');

    return {
        hook: locationHook,
        searchHook,
        reset,
        navigate,
    };
}
