import Config from './Config';

const config = new Config();

type ConfigFunc = {
    (): unknown;
    (key: string): unknown;
    (key: string, value: unknown): unknown;
};

const configFunc: ConfigFunc = (key?: string, value?: unknown) => {
    if (typeof value !== 'undefined') {
        return config.set(key as string, value);
    }
    if (typeof key === 'undefined') {
        return config.get();
    }
    return config.get(key);
};

export { Config };

export default configFunc;
