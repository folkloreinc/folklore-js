import { useLocation, useRouter } from 'wouter';

type RouteMatcher = (
    route: string,
    specificLocation?: string | null,
) => [boolean, Record<string, string>?];

const routesCache = new Map<
    string,
    {
        pattern: RegExp;
        keys: string[];
    }
>();

export default function useRouteMatcher(): RouteMatcher {
    'use memo';
    const router = useRouter();
    const [location] = useLocation();
    const matcher = (
        route: string,
        specificLocation: string | null = null,
    ): [boolean, Record<string, string>?] => {
        const path = specificLocation || location;
        // when parser is in "loose" mode, `$base` is equal to the
        // first part of the route that matches the pattern
        // (e.g. for pattern `/a/:b` and path `/a/1/2/3` the `$base` is `a/1`)
        // we use this for route nesting
        if (!routesCache.has(route)) {
            routesCache.set(route, router.parser(route || '*'));
        }
        const { pattern, keys } = routesCache.get(route);
        const [$base, ...matches] = pattern.exec(path) || [];

        return $base !== undefined
            ? [
                  true,

                  // an object with parameters matched, e.g. { foo: "bar" } for "/:foo"
                  // we "zip" two arrays here to construct the object
                  // ["foo"], ["bar"] → { foo: "bar" }
                  Object.fromEntries(
                      keys.map((key: string, i: number) => [key, matches[i]]),
                  ) as Record<string, string>,
              ]
            : [false];
    };
    return matcher;
}
