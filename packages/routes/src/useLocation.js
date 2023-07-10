import { useMemo } from 'react';
import { useLocation as useLocationBase } from 'wouter';
import { useSearch as useSearchBase } from 'wouter/use-location';

import parseLocation from './parseLocation';

export default function useLocation() {
    const [location, setLocation] = useLocationBase();
    const search = useSearchBase();
    const url = useMemo(() => parseLocation(location, search), [location, search]);
    return [url, setLocation];
}
