import createDebug from 'debug';
import { useRef, useCallback, useEffect, useState, useMemo } from 'react';

import usePlayerCurrentTime from './usePlayerCurrentTime';

export const NO_PLAYER_ERROR = new Error('No player');

export const isVideoId = (url) => url !== null && url.match(/^[0-9]+$/);

export default function useNativeVideoPlayer(
    url,
    {
        width = 0,
        height = 0,
        duration = 0,
        initialMuted = false,
        timeUpdateInterval = 1000,
        onTimeUpdate: customOnTimeUpdate = null,
    } = {},
) {
    const debug = useMemo(() => createDebug('folklore:video:native'), []);

    const elementRef = useRef(null);

    const [loaded, setLoaded] = useState(false);
    const [volume, setVolumeState] = useState(initialMuted ? 0 : 1);
    const [playState, setPlayState] = useState({
        playing: false,
        paused: false,
        ended: false,
        buffering: false,
    });

    const [metadata, setMetadata] = useState({
        width,
        height,
        duration,
    });

    const play = useCallback(() => {
        const { current: player } = elementRef;
        return player !== null ? player.play() : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const pause = useCallback(() => {
        const { current: player } = elementRef;
        return player !== null ? player.pause() : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const setVolume = useCallback((newVolume) => {
        const { current: player } = elementRef;
        if (player !== null) {
            player.volume = newVolume;
            return Promise.resolve(newVolume);
        }
        return Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const mute = useCallback(() => {
        const { current: player } = elementRef;
        if (player !== null) {
            player.muted = true;
            return Promise.resolve(true);
        }
        return Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const unmute = useCallback(() => {
        const { current: player } = elementRef;
        if (player !== null) {
            player.muted = false;
            return Promise.resolve(false);
        }
        return Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const seek = useCallback((newTime) => {
        const { current: player } = elementRef;
        if (player !== null) {
            player.currentTime = newTime;
            return Promise.resolve(newTime);
        }
        return Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const setLoop = useCallback((newLoop) => {
        const { current: player } = elementRef;
        if (player !== null) {
            player.loop = newLoop;
            return Promise.resolve(newLoop);
        }
        return Promise.reject(NO_PLAYER_ERROR);
    }, []);

    // Bind player events
    useEffect(() => {
        const { current: player } = elementRef;
        if (player === null) {
            return () => {};
        }

        const onCanPlay = () => {
            setLoaded(true);
            debug('onCanPlay [URL: %s]', url);
        };
        const onMetadataLoaded = () => {
            const newMetadata = {
                duration: player.duration,
                width: player.videoWidth,
                height: player.videoHeight,
            };
            setMetadata(newMetadata);
            debug('onMetadataLoaded [URL: %s]', url);
        };
        const onPlay = () => {
            setPlayState({
                playing: true,
                paused: false,
                ended: false,
                buffering: false,
            });
            debug('onPlay [URL: %s]', url);
        };
        const onPause = () => {
            setPlayState({
                playing: false,
                paused: true,
                ended: false,
                buffering: false,
            });
            debug('onPause [URL: %s]', url);
        };
        const onEnded = () => {
            setPlayState({
                playing: false,
                paused: false,
                ended: true,
                buffering: false,
            });
            debug('onEnded [URL: %s]', url);
        };

        debug('Bind events [URL: %s]', url);
        player.addEventListener('canplay', onCanPlay);
        player.addEventListener('metadataloaded', onMetadataLoaded);
        player.addEventListener('play', onPlay);
        player.addEventListener('pause', onPause);
        player.addEventListener('ended', onEnded);

        return () => {
            debug('Unbind events [URL: %s]', url);
            player.removeEventListener('canplay', onCanPlay);
            player.removeEventListener('metadataloaded', onMetadataLoaded);
            player.removeEventListener('play', onPlay);
            player.removeEventListener('pause', onPause);
            player.removeEventListener('ended', onEnded);
        };
    }, [url, elementRef.current, setPlayState, setMetadata, setVolumeState, setLoaded]);

    const { playing } = playState;
    const currentTime = usePlayerCurrentTime(elementRef.current, {
        id: url,
        disabled: !playing || timeUpdateInterval === null,
        updateInterval: timeUpdateInterval,
        onUpdate: customOnTimeUpdate,
    });

    return {
        ref: elementRef,
        player: elementRef.current,
        play,
        pause,
        mute,
        unmute,
        setVolume,
        seek,
        setLoop,
        ready: true,
        currentTime,
        loaded,
        muted: volume === 0,
        volume,
        ...metadata,
        ...playState,
    };
}
