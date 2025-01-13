import { useCallback, useEffect, useRef } from 'react';

import useTracking from './useTracking';

function useVideoTracking(player, params) {
    if (player === null) {
        return;
    }
    const {
        provider,
        id,
        url,
        title = null,
        thumbnail = null,
        disabled = false,
        progressSteps = [0.1, 0.25, 0.5, 0.75, 0.9, 1.0],
        onProgress = null,
    } = params || {};
    const tracking = useTracking();
    const progressTrackedRef = useRef({});
    const {
        playing = false,
        paused = false,
        ended = false,
        currentTime = false,
        duration = null,
    } = player;

    const getVideoMetadata = useCallback(
        (metadata) => {
            let metadataTitle = null;
            try {
                metadataTitle =
                    title !== null ? decodeURIComponent(title).replace(/[+]+/gi, ' ') : null;
            } catch (e) {
                console.log('error decoding title', e); // eslint-disable-line
            }
            return {
                platform: provider,
                id,
                url,
                title: metadataTitle,
                duration: duration || 0,
                thumbnail,
                ...metadata,
            };
        },
        [provider, id, title, url, duration, thumbnail],
    );

    useEffect(() => {
        if (playing && !disabled) {
            tracking.trackVideo(
                'play',
                getVideoMetadata({
                    currentTime,
                }),
            );
        }
    }, [playing, disabled]);

    useEffect(() => {
        if (paused && !disabled) {
            tracking.trackVideo(
                'pause',
                getVideoMetadata({
                    currentTime,
                }),
            );
        }
    }, [paused, disabled]);

    useEffect(() => {
        if (ended && !disabled) {
            tracking.trackVideo(
                'end',
                getVideoMetadata({
                    currentTime,
                }),
            );
        }
    }, [ended, disabled]);

    useEffect(() => {
        if (
            currentTime === null ||
            currentTime <= 0 ||
            duration === null ||
            duration <= 0 ||
            progressSteps === null ||
            progressSteps.length === 0 ||
            disabled
        ) {
            return;
        }
        const progress = currentTime / duration;
        const stepsToTrack = progressSteps.filter(
            (step) =>
                progress > step &&
                (typeof progressTrackedRef.current[id] === 'undefined' ||
                    typeof progressTrackedRef.current[id][step] === 'undefined'),
        );

        stepsToTrack.forEach((step) => {
            // console.log(
            // Math.round(step * 100, 10),
            //     getVideoMetadata({
            //         currentTime,
            //     }),
            // );
            tracking.trackVideo(
                'progress',
                getVideoMetadata({
                    currentTime,
                    videoProgress: Math.round(step * 100, 10),
                }),
            );

            if (onProgress !== null) {
                onProgress(step);
            }
        });

        if (stepsToTrack !== null && stepsToTrack.length > 0) {
            progressTrackedRef.current = {
                ...progressTrackedRef.current,
                [id]: {
                    ...progressTrackedRef.current[id],
                    ...stepsToTrack.reduce(
                        (stepsMap, step) => ({
                            ...stepsMap,
                            [step]: true,
                        }),
                        {},
                    ),
                },
            };
        }
    }, [currentTime, progressTrackedRef.current, id, onProgress, disabled]);
}

export default useVideoTracking;
