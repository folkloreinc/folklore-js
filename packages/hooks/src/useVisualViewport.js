import { useState, useEffect, useCallback } from 'react';

import useWindowSize from './useWindowSize';

export default function useVisualViewport() {
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const [
        {
            width: viewportWidth,
            height: viewportHeight,
            offsetTop = 0,
            offsetLeft = 0,
            pageLeft = 0,
            pageTop = 0,
        },
        setViewport,
    ] = useState({
        width: windowWidth,
        height: windowHeight,
    });

    const updateViewport = useCallback(
        (viewPort = null) => {
            setViewport(viewPort || window.visualViewport || {});
        },
        [setViewport],
    );

    useEffect(() => {
        if (typeof window === 'undefined' || (window.visualViewport || null) === null) {
            return () => {};
        }

        const onUpdate = (e) => {
            updateViewport(e.target);
        };
        updateViewport();

        window.visualViewport.addEventListener('resize', onUpdate);
        window.visualViewport.addEventListener('scroll', onUpdate);
        return () => {
            window.visualViewport.removeEventListener('resize', onUpdate);
            window.visualViewport.addEventListener('scroll', onUpdate);
        };
    }, [updateViewport]);

    return {
        width: viewportWidth || windowWidth,
        height: viewportHeight || windowHeight,
        offsetTop,
        offsetLeft,
        pageLeft,
        pageTop,
        updateViewport,
    };
}
