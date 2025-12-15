import { useEffect, useRef } from 'react';

import { useResizeObserver } from './useObserver';
import { eventsManager as windowEventsManager } from './useWindowEvent';
import useWindowSize from './useWindowSize';

function useScrollTrigger({
    disabled = false,
    triggers = [0.1, 0.25, 0.5, 0.75, 0.9, 1.0],
    useElementScroll = false,
    onTrigger = null,
} = {}) {
    const triggersCompletedRef = useRef([]);
    const { height } = useWindowSize();
    const {
        ref,
        entry: { contentRect = null },
    } = useResizeObserver({
        disabled: !useElementScroll,
    });
    const { top: elementTop = 0, height: elementHeight = null } = contentRect || {};
    const elementScrollHeight = elementHeight !== null ? elementHeight + elementTop : 0;

    useEffect(() => {
        if (windowEventsManager === null || disabled) {
            return () => {};
        }
        function onScroll() {
            const scrollY = useElementScroll ? ref.current.scrollTop : window.scrollY;

            let scrollHeight = 0;
            if (useElementScroll) {
                scrollHeight = ref.current.scrollHeight - ref.current.clientHeight;
            } else if (ref.current !== null && elementScrollHeight > 0) {
                scrollHeight = elementScrollHeight - height;
            } else {
                scrollHeight = document.documentElement.scrollHeight - height;
            }

            const progress = Math.min(Math.max(scrollY / scrollHeight, 0), 1);

            const newTriggersCompleted = triggers.filter(
                (step) => progress >= step && triggersCompletedRef.current.indexOf(step) === -1,
            );

            newTriggersCompleted.forEach((step) => {
                if (onTrigger != null) {
                    onTrigger(step);
                }
            });

            if (newTriggersCompleted.length > 0) {
                triggersCompletedRef.current = [
                    ...triggersCompletedRef.current,
                    ...newTriggersCompleted,
                ];
            }
        }

        if (useElementScroll) {
            ref.current.addEventListener('scroll', onScroll);
        } else {
            windowEventsManager.subscribe('scroll', onScroll);
        }

        onScroll();

        return () => {
            if (useElementScroll) {
                ref.current.removeEventListener('scroll', onScroll);
            } else {
                windowEventsManager.unsubscribe('scroll', onScroll);
            }
        };
    }, [triggers, disabled, onTrigger, height, elementScrollHeight, useElementScroll]);

    return {
        ref,
    };
}

export default useScrollTrigger;
