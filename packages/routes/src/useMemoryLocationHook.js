import { useCallback, useRef, useState } from 'react';
import { useLocationProperty } from 'wouter/use-location';

export default function useMemoryLocationHook() {
    const memoryLocationRef = useRef(null);
    const [, setMemoryLocation] = useState(null);
    const memoryHook = useCallback(() => {
        const location = useLocationProperty(() => {
            const newLocation = memoryLocationRef.current || '/';
            return newLocation;
        });
        return [
            location,
            (newLocation) => {
                memoryLocationRef.current = newLocation;
                setMemoryLocation(newLocation);
            },
        ];
    }, [setMemoryLocation]);
    return memoryHook;
}
