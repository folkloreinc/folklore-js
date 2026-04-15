import { useCallback, useEffect, useRef } from 'react';

import useTracking from './useTracking';

type VideoPlayerState = {
    playing?: boolean;
    paused?: boolean;
    ended?: boolean;
    currentTime?: number | null;
    duration?: number | null;
};

type UseVideoTrackingParams = {
    provider?: string;
    id?: string | null;
    url?: string | null;
    title?: string | null;
    thumbnail?: string | null;
    disabled?: boolean;
    progressSteps?: number[] | null;
    onProgress?: ((step: number) => void) | null;
};

function useVideoTracking(
    player: VideoPlayerState | null,
    params: UseVideoTrackingParams = {},
): void {
    'use memo';
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
    const progressTrackedRef = useRef<Record<string, Record<number, boolean>>>({});
    const {
        playing = false,
        paused = false,
        ended = false,
        currentTime = null,
        duration = null,
    } = player || {};

    const getVideoMetadata = useCallback(
        (metadata: Record<string, unknown>) => {
            let metadataTitle = null;
            try {
                metadataTitle =
                    title !== null ? decodeURIComponent(title).replace(/[+]+/gi, ' ') : null;
            } catch (e) {
                console.log('error decoding title', e);
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
        if (playing && !disabled && tracking !== null) {
            tracking.trackVideo(
                'play',
                getVideoMetadata({
                    currentTime,
                }),
            );
        }
    }, [playing, disabled, tracking, getVideoMetadata]);

    useEffect(() => {
        if (paused && !disabled && tracking !== null) {
            tracking.trackVideo(
                'pause',
                getVideoMetadata({
                    currentTime,
                }),
            );
        }
    }, [paused, disabled, currentTime, tracking, getVideoMetadata]);

    useEffect(() => {
        if (ended && !disabled && tracking !== null) {
            tracking.trackVideo(
                'end',
                getVideoMetadata({
                    currentTime,
                }),
            );
        }
    }, [ended, disabled, tracking, getVideoMetadata]);

    useEffect(() => {
        if (
            currentTime === null ||
            currentTime <= 0 ||
            duration === null ||
            duration <= 0 ||
            progressSteps === null ||
            progressSteps.length === 0 ||
            disabled ||
            tracking === null
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

        if (stepsToTrack.length > 0) {
            progressTrackedRef.current = {
                ...progressTrackedRef.current,
                [id || 'default']: {
                    ...progressTrackedRef.current[id || 'default'],
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
    }, [
        currentTime,
        duration,
        progressSteps,
        disabled,
        id,
        onProgress,
        tracking,
        getVideoMetadata,
    ]);
}

export default useVideoTracking;
