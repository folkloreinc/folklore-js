import { useRef } from 'react';

import { type UseInterserctionObserverOptions, useIntersectionObserver } from './useObserver';

type UseIsVisibleOptions = UseInterserctionObserverOptions & {
    persist?: boolean;
};

export function useIsVisible({ persist = false, ...opts }: UseIsVisibleOptions = {}) {
    const {
        ref,
        entry: { isIntersecting },
    } = useIntersectionObserver(opts);
    const dummyRef = useRef(null);

    const wasIntersectingRef = useRef(isIntersecting);
    if (isIntersecting && !wasIntersectingRef.current) {
        wasIntersectingRef.current = isIntersecting;
    }

    const isVisible = (!persist && isIntersecting) || (persist && wasIntersectingRef.current);

    return {
        ref: !persist || !isVisible ? ref : dummyRef,
        visible: isVisible,
    };
}
