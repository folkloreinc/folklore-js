import { type RefObject, useEffect, useRef, useState } from 'react';

interface UseScrollDataAttributeOptions {
    attributeName: `data-${string}`;
    disabled?: boolean;
    fallbackValue?: string | null;
    trackingElementSelector?: string | null;
    trackingElementRatio?: number;
}

interface UseScrollDataAttributeResult<T extends HTMLElement> {
    ref: RefObject<T | null>;
    value: string | null;
}

export default function useScrollDataAttribute<T extends HTMLElement = HTMLElement>({
    attributeName,
    disabled = false,
    fallbackValue = null,
    trackingElementSelector = null,
    trackingElementRatio = 0.5,
}: UseScrollDataAttributeOptions): UseScrollDataAttributeResult<T> {
    const ref = useRef<T>(null);
    const [value, setValue] = useState<string | null>(fallbackValue);

    useEffect(() => {
        if (disabled) {
            return () => {};
        }

        const container = ref.current;
        if (container === null) {
            return () => {};
        }

        let animationFrame: number | null = null;

        const updateValue = () => {
            animationFrame = null;

            const trackingElement = trackingElementSelector
                ? container.querySelector<HTMLElement>(trackingElementSelector)
                : null;
            const trackingElementRect = trackingElement?.getBoundingClientRect();
            const trackingPosition = trackingElementRect
                ? trackingElementRect.top + trackingElementRect.height * trackingElementRatio
                : 0;
            const trackedElements = container.querySelectorAll<HTMLElement>(`[${attributeName}]`);
            let activeValue = fallbackValue;

            trackedElements.forEach((element) => {
                if (element === trackingElement || trackingElement?.contains(element)) {
                    return;
                }

                const { top, bottom } = element.getBoundingClientRect();
                const attributeValue = element.getAttribute(attributeName);

                if (top <= trackingPosition && bottom > trackingPosition && attributeValue) {
                    activeValue = attributeValue;
                }
            });

            setValue((currentValue) => (currentValue === activeValue ? currentValue : activeValue));
        };

        const scheduleUpdate = () => {
            if (animationFrame === null) {
                animationFrame = window.requestAnimationFrame(updateValue);
            }
        };

        const observer = new MutationObserver(scheduleUpdate);
        observer.observe(container, {
            attributes: true,
            attributeFilter: [attributeName],
            childList: true,
            subtree: true,
        });

        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);
        scheduleUpdate();

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, [attributeName, disabled, fallbackValue, trackingElementRatio, trackingElementSelector]);

    return { ref, value: disabled ? fallbackValue : value };
}

export type { UseScrollDataAttributeOptions, UseScrollDataAttributeResult };
