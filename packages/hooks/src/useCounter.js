import raf from 'raf';
import { useState, useEffect } from 'react';

export default function useCounter(desiredValue, { maxDuration = 2000, speed = 1 / 10 }) {
    const [currentValue, setCurrentValue] = useState(desiredValue);
    useEffect(() => {
        let animationFrame = null;
        let startTime = null;
        let duration = 0;
        let canceled = false;
        const startValue = currentValue;
        const delta = desiredValue - startValue;

        function loop() {
            if (canceled) {
                return;
            }
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const newValue = Math.round(startValue + progress * delta);
            setCurrentValue(newValue);
            if (newValue !== desiredValue) {
                animationFrame = raf(loop);
            }
        }

        if (delta !== 0) {
            duration = Math.min(maxDuration, Math.abs(delta) * speed * 1000);
            startTime = Date.now();
            animationFrame = raf(loop);
        }

        return () => {
            canceled = true;
            if (animationFrame !== null) {
                raf.cancel(animationFrame);
            }
        };
    }, [desiredValue]);
    return currentValue;
}
