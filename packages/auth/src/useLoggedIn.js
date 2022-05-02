import { useAuthContext } from './AuthContext';

export default function useLoggedIn() {
    const { user } = useAuthContext();
    return user !== null;
}
