import { useState, useEffect } from 'react';

import useWindowSize from './useWindowSize';

const useVisualViewportSize = () => {
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const [{ width: viewportWidth, height: viewportHeight }, setViewportSize] = useState({
        width: windowWidth,
        height: windowHeight,
    });

    useEffect(() => {
        if (!typeof window !== 'undefined' && (window.visualViewport || null) !== null) {
            return () => {};
        }
        function onResize(e) {
            const viewport = e.target;
            setViewportSize({
                width: viewport.width,
                height: viewport.height,
            });
        }

        setViewportSize({
            width: window.visualViewport.width,
            height: window.visualViewport.height,
        });

        window.visualViewport.addEventListener('resize', onResize);
        return () => {
            window.visualViewport.removeEventListener('resize', onResize);
        };
    }, [setViewportSize]);

    return {
        width: viewportWidth || windowWidth,
        height: viewportHeight || windowHeight,
    };
};

export default useVisualViewportSize;
