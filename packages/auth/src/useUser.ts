import { type AuthUser, useAuthContext } from './AuthContext';

export default function useUser(): AuthUser {
    const { user } = useAuthContext();
    return user || null;
}
