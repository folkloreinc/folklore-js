import { JSX, type ReactNode, useCallback } from 'react';
import { BaseLocationHook, BaseSearchHook, Router, useRouter } from 'wouter';
import { navigate } from 'wouter/use-browser-location';

type StaticRouterProps = {
    location: string;
    search?: string | null;
    children: ReactNode;
};

function StaticRouter({ location, search = null, children }: StaticRouterProps): JSX.Element {
    const hook = useCallback<BaseLocationHook>(
        () => [location.split('?')[0], navigate],
        [location],
    );
    const searchHook = useCallback<BaseSearchHook>(
        () => search ?? (location.indexOf('?') !== -1 ? location.split('?')[1] : ''),
        [search, location],
    );
    const { parser } = useRouter();
    return (
        <Router parser={parser} hook={hook} searchHook={searchHook}>
            {children}
        </Router>
    );
}

export default StaticRouter;
