import EventEmitter from 'wolfy87-eventemitter';

const createLoader = (loader, getLibrary = null) => {
    let loading = false;
    let loaded = false;
    let loadedLibrary = null;
    const events = new EventEmitter();
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
                events.once('loaded', () => resolve(loadedLibrary));
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
