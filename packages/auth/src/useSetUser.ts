import { type AuthContextValue, useAuthContext } from './AuthContext';

export default function useSetUser(): AuthContextValue['setUser'] {
    const { setUser } = useAuthContext();
    return setUser;
}
