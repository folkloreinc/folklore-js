import { camelCase } from 'change-case';

const getOptionsFromEnv = ({ namespace = 'FLKLR' } = {}) =>
    Object.keys(process.env)
        .filter((key) => {
            const pattern = new RegExp(`^${namespace}_`, 'i');
            return pattern.test(key);
        })
        .reduce(
            (options, key) => ({
                ...options,
                [camelCase(key.replace(new RegExp(`^${namespace}_`, 'i'), ''))]: process.env[key],
            }),
            null,
        );

export default getOptionsFromEnv;
