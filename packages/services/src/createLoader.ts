import { EventEmitter } from '@folklore/events';

type Events = {
    loaded: (library: unknown) => void;
};

const createLoader = (loader, getLibrary = null) => {
    let loading = false;
    let loaded = false;
    let loadedLibrary = null;
    const events = new EventEmitter<Events>();
    return (...args) =>
        new Promise((resolve) => {
            if (loadedLibrary === null && getLibrary !== null) {
                loadedLibrary = getLibrary(...args);
            }
            if (loaded || loadedLibrary !== null) {
                resolve(loadedLibrary);
                return;
            }

            if (loading) {
                events.once('loaded', (lib) => resolve(lib));
                return;
            }

            loading = true;
            loader(...args).then((newLibrary = null) => {
                loadedLibrary = newLibrary;
                if (loadedLibrary === null && getLibrary !== null) {
                    loadedLibrary = getLibrary(...args);
                }
                loaded = true;
                resolve(loadedLibrary);
                events.emit('loaded', loadedLibrary);
            });
        });
};

export default createLoader;
