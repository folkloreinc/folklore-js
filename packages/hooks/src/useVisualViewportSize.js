import { useState, useEffect, useCallback } from 'react';

import useWindowSize from './useWindowSize';

const hasViewport = typeof window !== 'undefined' && (window.visualViewport || null) !== null;

const useVisualViewportSize = () => {
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const [{ width: viewportWidth, height: viewportHeight }, setViewportSize] = useState({
        width: windowWidth,
        height: windowHeight,
    });

    const onResize = useCallback(
        (e) => {
            const viewport = e.target;
            setViewportSize({
                width: viewport.width,
                height: viewport.height,
            });
        },
        [setViewportSize],
    );

    useEffect(() => {
        if (!hasViewport) {
            return () => {};
        }
        window.visualViewport.addEventListener('resize', onResize);
        return () => {
            window.visualViewport.removeEventListener('resize', onResize);
        };
    }, [onResize]);

    return {
        width: viewportWidth || windowWidth,
        height: viewportHeight || windowHeight,
    };
};

export default useVisualViewportSize;
