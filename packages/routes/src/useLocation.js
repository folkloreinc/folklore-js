import { useMemo } from 'react';
import { useLocation as useLocationBase } from 'wouter';

export default function useLocation () {
    const [location, setLocation] = useLocationBase();
    const url = useMemo(() => new URL(location || '/'), [location]);
    return [url, setLocation];
}
