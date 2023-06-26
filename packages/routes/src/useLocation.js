import { useMemo } from 'react';
import { useLocation as useLocationBase } from 'wouter';

import parseLocation from './parseLocation';

export default function useLocation() {
    const [location, setLocation] = useLocationBase();
    const url = useMemo(() => parseLocation(location), [location]);
    return [url, setLocation];
}
