import { useAuthContext } from './AuthContext';

export default function useLoggedIn(): boolean {
    const { user } = useAuthContext();
    return user !== null;
}
