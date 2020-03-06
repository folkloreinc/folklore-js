import EventEmitter from 'wolfy87-eventemitter';

const createLoader = (loader, getLibrary = null) => {
    let loading = false;
    let loaded = false;
    const events = new EventEmitter();
    return (...args) =>
        new Promise(resolve => {
            const existingLibrary = getLibrary !== null ? getLibrary(...args) : null;
            if (loaded || existingLibrary !== null) {
                resolve(existingLibrary);
                return;
            }

            if (loading) {
                events.once('loaded', resolve);
                return;
            }

            loading = true;
            loader(...args).then((loadedLibrary = null) => {
                let library = loadedLibrary;
                if (library === null && getLibrary !== null) {
                    library = getLibrary(...args);
                }
                loaded = true;
                resolve(library);
                events.emit('loaded', library);
            });
        });
};

export default createLoader;
