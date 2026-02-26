import { useCallback, useEffect, useRef, useState } from 'react';

import useWindowEvent from './useWindowEvent';

type WindowSize = {
    width: number;
    height: number;
};

type UseWindowSizeOptions = {
    onChange?: (size: WindowSize) => void;
    onMount?: boolean;
    memo?: boolean;
};

export function getWindowSize(): WindowSize {
    return {
        width: typeof window !== 'undefined' ? window.innerWidth || 0 : 0,
        height: typeof window !== 'undefined' ? window.innerHeight || 0 : 0,
    };
}

let currentSize = null;

export default function useWindowSize(opts: UseWindowSizeOptions = null): WindowSize {
    const { onChange = null, onMount = false, memo = false } = opts || {};
    const [size, setSize] = useState(() =>
        onMount
            ? getWindowSize()
            : {
                  width: 0,
                  height: 0,
              },
    );
    const sizeRef = useRef(size);
    if (currentSize === null && memo) {
        currentSize = size;
    }

    const updateSize = useCallback(() => {
        const newSize = getWindowSize();
        if (
            memo &&
            (currentSize.width !== newSize.width || currentSize.height !== newSize.height)
        ) {
            currentSize = newSize;
        }
        if (sizeRef.current.width !== newSize.width || sizeRef.current.height !== newSize.height) {
            sizeRef.current = newSize;
            setSize(newSize);
            return newSize;
        }
        return null;
    }, [setSize, memo]);

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
