import { useCallback, useEffect, useRef, useState } from 'react';

import useWindowEvent from './useWindowEvent';

type WindowScroll = {
    x: number;
    y: number;
};

type UseWindowScrollOptions = {
    onChange?: (scroll: WindowScroll) => void;
    onMount?: boolean;
    memo?: boolean;
};

function getWindowScroll(): WindowScroll {
    return {
        x: typeof window !== 'undefined' ? window.scrollX || 0 : 0,
        y: typeof window !== 'undefined' ? window.scrollY || 0 : 0,
    };
}

let currentScroll = null;

export default function useWindowScroll({
    onChange = null,
    onMount = false,
    memo = false,
}: UseWindowScrollOptions = {}): WindowScroll {
    const [scroll, setScroll] = useState(() => (onMount ? getWindowScroll() : { x: 0, y: 0 }));
    const scrollRef = useRef(scroll);
    if (currentScroll === null && memo) {
        currentScroll = scroll;
    }

    const updateScroll = useCallback(() => {
        const newScroll = getWindowScroll();
        const { x: currentX, y: currentY } = currentScroll || {};
        if (memo && (currentX !== newScroll.x || currentY !== newScroll.y)) {
            currentScroll = newScroll;
        }
        if (scrollRef.current.x !== newScroll.x || scrollRef.current.y !== newScroll.y) {
            scrollRef.current = newScroll;
            setScroll(newScroll);
            return newScroll;
        }
        return null;
    }, [setScroll, memo]);

    const onScroll = useCallback(() => {
        const newScroll = updateScroll();
        if (newScroll !== null && onChange !== null) {
            onChange(newScroll);
        }
    }, [updateScroll, onChange]);

    useWindowEvent('scroll', onScroll);

    useEffect(() => {
        onScroll();
    }, []);

    return scroll;
}
