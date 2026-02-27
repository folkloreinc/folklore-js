import { JSX, type ReactNode, createContext, useContext, useMemo } from 'react';

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
    return useContext(RoutesContext);
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
    const value = useMemo(
        () => ({
            routes,
            basePath,
        }),
        [routes, basePath],
    );
    return <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>;
}

export default RoutesContext;
