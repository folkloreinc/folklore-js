import { useState, useCallback, useEffect } from 'react';

import useWindowEvent from './useWindowEvent';

const getWindowScroll = () => ({
    x: typeof window !== 'undefined' ? window.scrollX || 0 : 0,
    y: typeof window !== 'undefined' ? window.scrollY || 0 : 0,
});

const currentScroll = getWindowScroll();

export default function useWindowScroll(opts = {}) {
    const { onChange = null } = opts;
    const [scroll, setScroll] = useState(currentScroll);

    const updateScroll = useCallback(() => {
        const newScroll = getWindowScroll();
        if (currentScroll.x !== newScroll.x || currentScroll.y !== newScroll.y) {
            currentScroll.x = newScroll.x;
            currentScroll.y = newScroll.y;
            setScroll(newScroll);
            return newScroll;
        }
        return null;
    }, [setScroll]);

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
