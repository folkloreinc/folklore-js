import { JSX, type ReactNode, createContext, use } from 'react';

export type RoutesMap = Record<string, string>;

export type RoutesContextValue = {
    routes: RoutesMap;
    basePath: string | null;
};

const defaultValue: RoutesContextValue = {
    routes: {},
    basePath: null,
};

export const RoutesContext = createContext<RoutesContextValue | null>(defaultValue);

export function useRoutesContext(): RoutesContextValue {
    return use(RoutesContext);
}

type RoutesProviderProps = {
    children: ReactNode;
    routes: RoutesMap;
    basePath?: string | null;
};

export function RoutesProvider({
    routes,
    basePath = null,
    children,
}: RoutesProviderProps): JSX.Element {
    const { routes: previousRoutes, basePath: previousBasePath } = use(RoutesContext);
    const value = {
        routes: { ...previousRoutes, ...routes },
        basePath: basePath ?? previousBasePath,
    };
    return <RoutesContext value={value}>{children}</RoutesContext>;
}

export default RoutesContext;
