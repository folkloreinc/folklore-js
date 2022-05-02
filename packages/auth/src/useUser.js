import { useAuthContext } from './AuthContext';

export default function useUser() {
    const { user } = useAuthContext();
    return user || null;
}
