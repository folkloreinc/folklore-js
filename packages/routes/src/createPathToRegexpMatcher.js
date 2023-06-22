import { pathToRegexp } from 'path-to-regexp';
import makeCachedMatcher from 'wouter/matcher';

export default function createPathToRegexpMatcher(opts) {
    const convertPathToRegexp = (path) => {
        // eslint-disable-next-line prefer-const
        let keys = [];

        // we use original pathToRegexp package here with keys
        const regexp = pathToRegexp(path, keys, { strict: false, ...opts });

        return { keys, regexp };
    };

    const pathToRegexpMatcher = makeCachedMatcher(convertPathToRegexp);
    return (pattern, path) => {
        const { pathname } = new URL(path, `${window.location.protocol}//${window.location.host}`);
        return pathToRegexpMatcher(pattern, pathname);
    };
}
