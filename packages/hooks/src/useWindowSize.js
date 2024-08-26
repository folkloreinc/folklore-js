import { useState, useCallback, useEffect, useRef } from 'react';

import useWindowEvent from './useWindowEvent';

export const getWindowSize = () => ({
    width: typeof window !== 'undefined' ? window.innerWidth || 0 : 0,
    height: typeof window !== 'undefined' ? window.innerHeight || 0 : 0,
});

let currentSize = getWindowSize();

export default function useWindowSize({ onChange = null } = {}) {
    const [size, setSize] = useState(currentSize);
    const sizeRef = useRef(size);

    const updateSize = useCallback(() => {
        const newSize = getWindowSize();
        if (currentSize.width !== newSize.width || currentSize.height !== newSize.height) {
            currentSize = newSize;
        }
        if (sizeRef.current.width !== newSize.width || sizeRef.current.height !== newSize.height) {
            sizeRef.current = newSize;
            setSize(newSize);
            return newSize;
        }
        return null;
    }, [setSize]);

    const onResize = useCallback(() => {
        const newSize = updateSize();
        if (newSize !== null && onChange !== null) {
            onChange(newSize);
        }
    }, [onChange, updateSize]);

    useWindowEvent('resize', onResize);

    useEffect(() => {
        onResize();
    }, []);

    return size;
}
