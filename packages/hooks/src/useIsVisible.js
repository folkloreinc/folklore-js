import { useRef } from 'react';

import { useIntersectionObserver } from './useObserver';

function useIsVisible({ persist = false, ...opts } = {}) {
    const {
        ref,
        entry: { isIntersecting },
    } = useIntersectionObserver(opts);

    const wasIntersecting = useRef(isIntersecting);
    if (isIntersecting && !wasIntersecting.current) {
        wasIntersecting.current = isIntersecting;
    }

    const isVisible = (!persist && isIntersecting) || (persist && wasIntersecting.current);

    return {
        ref: !persist || !isVisible ? ref : { current: null },
        visible: isVisible,
    };
}

export default useIsVisible;
