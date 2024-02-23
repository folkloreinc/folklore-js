import mitt from 'mitt';
import { useSyncExternalStore } from 'react';

import parseLocation from './parseLocation';

export default function useMemoryRouter({
    path = '/',
    static: staticLocation = false,
    record = true,
} = {}) {
    let currentPath = parseLocation(path);
    const history = [currentPath];
    const emitter = mitt();

    const navigateImplementation = (newPath, { replace = false } = {}) => {
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

    const navigate = !staticLocation ? navigateImplementation : () => null;

    const subscribe = (cb) => {
        emitter.on('navigate', cb);
        return () => emitter.off('navigate', cb);
    };

    function reset() {
        // clean history array with mutation to preserve link
        history.splice(0, history.length);

        navigateImplementation(path);
    }

    const locationHook = () => [
        useSyncExternalStore(subscribe, () => currentPath.pathname),
        navigate,
    ];
    const searchHook = () => useSyncExternalStore(subscribe, () => currentPath.search || '');

    return {
        hook: locationHook,
        searchHook,
        reset,
        navigate,
    };
}
