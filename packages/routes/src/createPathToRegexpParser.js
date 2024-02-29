import { pathToRegexp } from 'path-to-regexp';

export default function createPathToRegexpParser(opts) {
    return (fullPath, loose) => {
        const path = fullPath.replace(/^(https?:\/\/[^/]+)\/?/, '/');
        const keys = [];
        const isWildcard = path.match(/(\/|^)\*$/) !== null;
        const pattern = pathToRegexp(isWildcard ? path.replace(/(\/|^)\*$/, '$1(.*)') : path, keys, {
            end: !loose && !isWildcard,
            ...opts,
        });

        return {
            pattern,
            // `pathToRegexp` returns some metadata about the keys,
            // we want to strip it to just an array of keys
            keys: keys.map((k) => k.name),
        };
    };
}
