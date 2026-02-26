import { Key, pathToRegexp } from 'path-to-regexp';

type PathParserResult = {
    pattern: RegExp;
    keys: (string | number)[];
};

type CreatePathToRegexpParserOpts = Parameters<typeof pathToRegexp>[2];

export default function createPathToRegexpParser(opts: CreatePathToRegexpParserOpts = {}) {
    return (fullPath: string, loose?: boolean): PathParserResult => {
        const path = fullPath.replace(/^(https?:\/\/[^/]+)\/?/, '/');
        const keys: Key[] = [];
        const isWildcard = path.match(/(\/|^)\*$/) !== null;
        const pattern = pathToRegexp(
            isWildcard ? path.replace(/(\/|^)\*$/, '$1(.*)') : path,
            keys,
            {
                end: !loose && !isWildcard,
                ...opts,
            },
        );

        return {
            pattern,
            // `pathToRegexp` returns some metadata about the keys,
            // we want to strip it to just an array of keys
            keys: keys.map((k) => k.name),
        };
    };
}
