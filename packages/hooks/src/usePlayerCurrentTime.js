import { useState, useEffect, useRef } from 'react';

function usePlayerCurrentTime(
    player,
    {
        id = null,
        disabled = false,
        updateInterval = 1000,
        onUpdate: customOnUpdate = null,
        getCurrentTime = (p) => p.currentTime,
    } = {},
) {
    const [currentTime, setCurrentTime] = useState(0);
    const realCurrentTime = useRef(currentTime);

    const lastIdRef = useRef(id);
    const idChanged = lastIdRef.current !== id;
    if (idChanged) {
        realCurrentTime.current = 0;
        lastIdRef.current = id;
    }

    // Check time update
    useEffect(() => {
        if (disabled || player === null) {
            return () => {};
        }
        let canceled = false;
        const updateTime = (time) => {
            if (canceled) {
                return;
            }
            realCurrentTime.current = time;
            setCurrentTime(time);

            if (customOnUpdate !== null) {
                customOnUpdate(time);
            }
        };
        const interval = setInterval(() => {
            const time = getCurrentTime(player);
            if (typeof time.then !== 'undefined') {
                time.then(updateTime);
            } else {
                updateTime(time);
            }
        }, updateInterval);
        return () => {
            canceled = true;
            clearInterval(interval);
        };
    }, [id, player, setCurrentTime, disabled, updateInterval, getCurrentTime]);

    return realCurrentTime.current;
}

export default usePlayerCurrentTime;
