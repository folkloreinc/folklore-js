import { useCallback } from 'react';
import { useRouter, useLocation } from 'wouter';

export default function useRouteMatcher() {
    const router = useRouter();
    const [location] = useLocation();
    const matcher = useCallback(
        (route, specificLocation = null) => {
            const path = specificLocation || location;
            // when parser is in "loose" mode, `$base` is equal to the
            // first part of the route that matches the pattern
            // (e.g. for pattern `/a/:b` and path `/a/1/2/3` the `$base` is `a/1`)
            // we use this for route nesting
            const { pattern, keys } = router.parser(route || '*');
            const [$base, ...matches] = pattern.exec(path) || [];

            return $base !== undefined
                ? [
                      true,

                      // an object with parameters matched, e.g. { foo: "bar" } for "/:foo"
                      // we "zip" two arrays here to construct the object
                      // ["foo"], ["bar"] → { foo: "bar" }
                      Object.fromEntries(keys.map((key, i) => [key, matches[i]])),
                  ]
                : [false];
        },
        [router, location],
    );
    return matcher;
}
