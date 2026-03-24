import { pathToRegexp } from 'path-to-regexp';
import { type Parser } from 'wouter';

type CreatePathToRegexpParserOpts = Parameters<typeof pathToRegexp>[1];

export default function createPathToRegexpParser(opts: CreatePathToRegexpParserOpts = {}): Parser {
    return (fullPath: string, loose?: boolean) => {
        const path = fullPath.replace(/^(https?:\/\/[^/]+)\/?/, '/');
        const isWildcard = path.match(/(\/|^)\*$/) !== null;
        const { regexp, keys } = pathToRegexp(
            isWildcard ? path.replace(/(\/|^)\*$/, '$1(.*)') : path,
            {
                end: !loose && !isWildcard,
                ...opts,
            },
        );

        return {
            pattern: regexp,
            // `pathToRegexp` returns some metadata about the keys,
            // we want to strip it to just an array of keys
            keys: keys.map((k) => `${k.name}`),
        };
    };
}
