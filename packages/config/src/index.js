import Config from './Config';

const config = new Config();

// eslint-disable-next-line no-unused-vars
const configFunc = (key, value) => {
    if (typeof value !== 'undefined') {
        return config.set(key, value);
    }
    if (typeof key === 'undefined') {
        return config.get();
    }
    return config.get(key);
};

export {
    Config,
};

export default configFunc;
