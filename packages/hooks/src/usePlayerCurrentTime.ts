import { useEffect, useRef, useState } from 'react';

import { VideoPlayer } from './videoPlayer';

type Player = HTMLVideoElement | HTMLAudioElement | VideoPlayer;

type UsePlayerCurrentTimeOptions<P> = {
    id?: string | number | null;
    disabled?: boolean;
    updateInterval?: number;
    onUpdate?: (time: number) => void;
    getCurrentTime?: (player: P) => number | Promise<number>;
};

function defaultGetCurrentTime(player) {
    if (typeof player.currentTime === 'number') {
        return player.currentTime;
    }
    return 0;
}

export default function usePlayerCurrentTime<P = Player>(
    player: P | null,
    {
        id = null,
        disabled = false,
        updateInterval = 1000,
        onUpdate: customOnUpdate = null,
        getCurrentTime = defaultGetCurrentTime,
    }: UsePlayerCurrentTimeOptions<P> = {},
): number {
    const [currentTime, setCurrentTime] = useState(0);
    const realCurrentTimeRef = useRef(currentTime);

    const lastIdRef = useRef(id);
    const idChanged = lastIdRef.current !== id;
    if (idChanged) {
        realCurrentTimeRef.current = 0;
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
            realCurrentTimeRef.current = time;
            setCurrentTime(time);

            if (customOnUpdate !== null) {
                customOnUpdate(time);
            }
        };
        const interval = setInterval(() => {
            const time = getCurrentTime(player);
            if (typeof time === 'object' && typeof time.then === 'function') {
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

    return realCurrentTimeRef.current;
}
