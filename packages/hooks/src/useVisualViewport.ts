import { useCallback, useEffect, useState } from 'react';

import useWindowSize from './useWindowSize';

interface VisualViewportData {
    width: number;
    height: number;
    offsetTop?: number;
    offsetLeft?: number;
    pageLeft?: number;
    pageTop?: number;
}

export default function useVisualViewport(): VisualViewportData & {
    updateViewport: (viewPort?: VisualViewport) => void;
} {
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const [viewport, setViewport] = useState<VisualViewportData>({
        width: windowWidth,
        height: windowHeight,
    });

    const updateViewport = useCallback(
        (newViewport = null) => {
            const {
                width: newWidth = 0,
                height: newHeight = 0,
                offsetTop: newOffsetTop = 0,
                offsetLeft: newOffsetLeft = 0,
                pageLeft: newPageLeft = 0,
                pageTop: newPageTop = 0,
            } = newViewport || window.visualViewport || {};
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

    const { width: viewportWidth, height: viewportHeight, ...otherViewport } = viewport;

    return {
        width: viewportWidth || windowWidth,
        height: viewportHeight || windowHeight,
        ...otherViewport,
        updateViewport,
    };
}
