import {
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';

export type AuthUser = {
    id: string;
    [key: string]: unknown;
} | null;

export type AuthContextValue = {
    user: AuthUser;
    setUser: Dispatch<SetStateAction<AuthUser>>;
};

const defaultAuthContext: AuthContextValue = {
    user: null,
    setUser: () => undefined,
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

export const useAuthContext = (): AuthContextValue => useContext(AuthContext);

type AuthProviderProps = {
    user?: AuthUser;
    children: ReactNode;
};

export function AuthProvider({ user: providedUser = null, children }: AuthProviderProps) {
    const [stateUser, setUser] = useState<AuthUser>(null);

    const value = useMemo<AuthContextValue>(
        () => ({
            user: stateUser || providedUser,
            setUser,
        }),
        [stateUser, providedUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
