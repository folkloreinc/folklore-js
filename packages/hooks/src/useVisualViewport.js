import { useState, useEffect } from 'react';

import useWindowSize from './useWindowSize';

const useVisualViewport = () => {
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

    useEffect(() => {
        if (!typeof window !== 'undefined' && (window.visualViewport || null) !== null) {
            return () => {};
        }
        function updateViewport(e) {
            setViewport(e.target);
        }

        setViewport(window.visualViewport);

        window.visualViewport.addEventListener('resize', updateViewport);
        window.visualViewport.addEventListener('scroll', updateViewport);
        return () => {
            window.visualViewport.removeEventListener('resize', updateViewport);
            window.visualViewport.addEventListener('scroll', updateViewport);
        };
    }, [setViewport]);

    return {
        width: viewportWidth || windowWidth,
        height: viewportHeight || windowHeight,
        offsetTop,
        offsetLeft,
        pageLeft,
        pageTop,
    };
};

export default useVisualViewport;
