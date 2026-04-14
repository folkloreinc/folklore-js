import { JSX, type ReactNode } from 'react';
import { BaseLocationHook, BaseSearchHook, Router, useRouter } from 'wouter';
import { navigate } from 'wouter/use-browser-location';

type StaticRouterProps = {
    location: string;
    search?: string | null;
    children: ReactNode;
};

function StaticRouter({ location, search = null, children }: StaticRouterProps): JSX.Element {
    'use memo';
    const hook: BaseLocationHook = () => [location.split('?')[0], navigate];
    const searchHook: BaseSearchHook = () =>
        search ?? (location.indexOf('?') !== -1 ? location.split('?')[1] : '');
    const { parser } = useRouter();
    return (
        <Router parser={parser} hook={hook} searchHook={searchHook}>
            {children}
        </Router>
    );
}

export default StaticRouter;
