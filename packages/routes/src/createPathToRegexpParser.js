import { pathToRegexp } from 'path-to-regexp';

export default function createPathToRegexpParser(opts) {
    return (path, loose) => {
        const keys = [];
        const pattern = pathToRegexp(path, keys, {  ...opts });

        return {
            pattern,
            // `pathToRegexp` returns some metadata about the keys,
            // we want to strip it to just an array of keys
            keys: keys.map((k) => k.name),
        };
    };
}
