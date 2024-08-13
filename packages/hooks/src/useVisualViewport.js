import { useState, useEffect, useCallback } from 'react';

import useWindowSize from './useWindowSize';

export default function useVisualViewport() {
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const [{ width: viewportWidth, height: viewportHeight, ...viewport }, setViewport] = useState({
        width: windowWidth,
        height: windowHeight,
    });

    const updateViewport = useCallback(
        (viewPort = null) => {
            const {
                width: newWidth = 0,
                height: newHeight = 0,
                offsetTop: newOffsetTop = 0,
                offsetLeft: newOffsetLeft = 0,
                pageLeft: newPageLeft = 0,
                pageTop: newPageTop = 0,
            } = viewPort || window.visualViewport || {};
            setViewport({
                width: newWidth,
                height: newHeight,
                offsetTop: newOffsetTop,
                offsetLeft: newOffsetLeft,
                pageLeft: newPageLeft,
                pageTop: newPageTop,
            });
        },
        [setViewport],
    );

    useEffect(() => {
        if (typeof window.visualViewport === 'undefined') {
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
            window.visualViewport.removeEventListener('scroll', onUpdate);
        };
    }, [updateViewport]);

    return {
        width: viewportWidth || windowWidth,
        height: viewportHeight || windowHeight,
        ...viewport,
        updateViewport,
    };
}
