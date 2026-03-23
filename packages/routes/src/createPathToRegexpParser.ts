import { Key, pathToRegexp } from 'path-to-regexp';
import { type Parser } from 'wouter';

type CreatePathToRegexpParserOpts = Parameters<typeof pathToRegexp>[2];

export default function createPathToRegexpParser(opts: CreatePathToRegexpParserOpts = {}): Parser {
    return (fullPath: string, loose?: boolean) => {
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
            keys: keys.map((k) => `${k.name}`),
        };
    };
}
