import { useMemo } from 'react';
import { useLocation as useLocationBase } from 'wouter';

export default function useLocation(baseUrl) {
    const [location, setLocation] = useLocationBase();
    const url = useMemo(
        () =>
            new URL(
                location || '/',
                baseUrl || `${window.location.protocol}//${window.location.host}`,
            ),
        [baseUrl, location],
    );
    return [url, setLocation];
}
