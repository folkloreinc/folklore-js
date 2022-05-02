import { useAuthContext } from './AuthContext';

export default function useUser() {
    const { setUser } = useAuthContext();
    return setUser;
}
