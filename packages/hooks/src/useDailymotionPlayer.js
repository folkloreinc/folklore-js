import { loadDailymotion } from '@folklore/services';
import createDebug from 'debug';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';

import usePlayerCurrentTime from './usePlayerCurrentTime';

export const NO_PLAYER_ERROR = new Error('No player');

export default function useDailymotionPlayer(id = null, params = {}) {
    const {
        width = 0,
        height = 0,
        duration = 0,
        autoplay = false,
        muted: initialMuted = false,
        start = 0,
        controls = true,
        queueAutoplayNext = false,
        queueEnable = false,
        sharingEnable = false,
        uiLogo = false,
        uiStartScreenInfo = true,
        timeUpdateInterval = 1000,
        onTimeUpdate: customOnTimeUpdate = null,
        getVideoId = (url) => {
            if (url === null || url.match(/^https?:/) === null) {
                return url;
            }
            let match = url.match(/\/video\/([^/?]+)/);
            if (match !== null) {
                return match[1];
            }
            match = url.match(/video=([^/?&]+)/);
            if (match !== null) {
                return match[1];
            }
            return null;
        },
    } = params;

    const debug = useMemo(() => createDebug('folklore:video:dailymotion'), []);

    const [apiLoaded, setApiLoaded] = useState(
        typeof window !== 'undefined' && typeof window.dailymotion !== 'undefined',
    );
    const [playerReady, setPlayerReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const apiRef = useRef(
        typeof window !== 'undefined' && typeof window.dailymotion !== 'undefined' ? window.dailymotion : null,
    );
    const ready = apiLoaded && playerReady;
    const videoId = useMemo(() => getVideoId(id), [id]);

    const elementRef = useRef(null);
    const playerRef = useRef(null);
    const playerElementRef = useRef(elementRef.current);
    if (elementRef.current !== null && playerElementRef.current === null) {
        playerElementRef.current = elementRef.current;
    }
    const elementHasChanged = elementRef.current !== playerElementRef.current;

    const [muted, setMuted] = useState(initialMuted);
    const [volume, setVolumeState] = useState(initialMuted ? 0 : 1);
    const [playState, setPlayState] = useState({
        playing: false,
        paused: false,
        ended: false,
        buffering: false,
        adPlaying: false,
    });

    const [metadata, setMetadata] = useState({
        width,
        height,
        duration,
    });

    // Load SDK
    useEffect(() => {
        let canceled = false;
        if (!apiLoaded && videoId !== null) {
            debug('Load API');
            loadDailymotion({
                url: 'https://geo.dailymotion.com/libs/player.js',
                callback: null,
            }).then((api) => {
                if (!canceled) {
                    apiRef.current = api;
                    setApiLoaded(true);
                    debug('API Loaded');
                }
            });
        }
        return () => {
            canceled = true;
        };
    }, [videoId, apiLoaded, setApiLoaded]);

    // Create or update player
    useEffect(() => {
        const { current: dailymotion = null } = apiRef;
        const { current: currentPlayer = null } = playerRef;
        const { current: element = null } = elementRef;
        if (!apiLoaded || videoId === null || element === null) {
            return;
        }
        const playerParams = {
            'autoplay-d': autoplay,
            // muted,
            start,
            controls,
            'queue-autoplay-next': queueAutoplayNext,
            'queue-enable': queueEnable,
            'sharing-enable': sharingEnable,
            'ui-logo': uiLogo,
            'ui-start-screen-info': uiStartScreenInfo,
        };
        let player = currentPlayer;
        if (player !== null) {
            player.load(videoId, {
                params: playerParams,
            });
            debug('Load video [ID: %s]', videoId);
        } else {
            player = dailymotion.createPlayer(element, {
                video: videoId,
                width,
                height,
                params: playerParams,
            });
            debug('Create player [ID: %s]', videoId);
        }
        if (!playerReady) {
            setPlayerReady(true);
        }
        playerRef.current = player;
        playerElementRef.current = element;
    }, [
        apiLoaded,
        elementHasChanged,
        videoId,
        width,
        height,
        autoplay,
        muted,
        start,
        controls,
        queueAutoplayNext,
        queueEnable,
        sharingEnable,
        uiLogo,
        uiStartScreenInfo,
    ]);

    useEffect(() => {
        const { current: player = null } = playerRef;
        if (player === null) {
            return () => {};
        }

        let currentPlayState = playState;
        let currentMetadata = metadata;

        function onPlaybackReady() {
            setLoaded(true);
            debug('onPlaybackReady [ID: %s]', videoId);
        }

        function onLoadedMetadata() {
            currentMetadata = {
                ...currentMetadata,
                duration: player.duration,
            };
            setMetadata(currentMetadata);
            debug('onLoadedMetadata [ID: %s]', videoId);
        }

        function onDurationChange() {
            currentMetadata = {
                ...currentMetadata,
                duration: player.duration,
            };
            setMetadata(currentMetadata);
            debug('onDurationChange [ID: %s]', videoId);
        }

        function onVolumeChange() {
            setMuted(player.muted);
            setVolumeState(player.volume);
            debug('onVolumeChange [ID: %s]', videoId);
        }

        function onPlay() {
            currentPlayState = {
                ...currentPlayState,
                playing: true,
                paused: false,
                ended: false,
            };
            setPlayState(currentPlayState);
            debug('onPlay [ID: %s]', videoId);
        }

        function onPause() {
            currentPlayState = {
                ...currentPlayState,
                playing: false,
                paused: true,
                ended: false,
            };
            setPlayState(currentPlayState);
            debug('onPause [ID: %s]', videoId);
        }

        function onEnd() {
            currentPlayState = {
                ...currentPlayState,
                playing: false,
                paused: false,
                ended: true,
            };
            setPlayState(currentPlayState);
            debug('onEnd [ID: %s]', videoId);
        }

        function onPlaying() {
            currentPlayState = {
                ...currentPlayState,
                buffering: false,
            };
            setPlayState(currentPlayState);
            debug('onPlaying [ID: %s]', videoId);
        }

        function onWaiting() {
            currentPlayState = {
                ...currentPlayState,
                buffering: true,
            };
            setPlayState(currentPlayState);
            debug('onWaiting [ID: %s]', videoId);
        }

        function onAdStart() {
            currentPlayState = {
                ...currentPlayState,
                adPlaying: true,
            };
            setPlayState(currentPlayState);
            debug('onAdStart [ID: %s]', videoId);
        }

        function onAdEnd() {
            currentPlayState = {
                ...currentPlayState,
                adPlaying: false,
            };
            setPlayState(currentPlayState);
            debug('onAdEnd [ID: %s]', videoId);
        }

        player.addEventListener('playback_ready', onPlaybackReady);
        player.addEventListener('loadedmetadata', onLoadedMetadata);
        player.addEventListener('durationchange', onDurationChange);
        player.addEventListener('volumechange', onVolumeChange);
        player.addEventListener('play', onPlay);
        player.addEventListener('pause', onPause);
        player.addEventListener('video_end', onEnd);
        player.addEventListener('playing', onPlaying);
        player.addEventListener('waiting', onWaiting);
        player.addEventListener('ad_start', onAdStart);
        player.addEventListener('ad_end', onAdEnd);

        return () => {
            player.removeEventListener('playback_ready', onPlaybackReady);
            player.removeEventListener('loadedmetadata', onLoadedMetadata);
            player.removeEventListener('durationchange', onDurationChange);
            player.removeEventListener('volumechange', onVolumeChange);
            player.removeEventListener('play', onPlay);
            player.removeEventListener('pause', onPause);
            player.removeEventListener('video_end', onEnd);
            player.removeEventListener('playing', onPlaying);
            player.removeEventListener('waiting', onWaiting);
            player.removeEventListener('ad_start', onAdStart);
            player.removeEventListener('ad_end', onAdEnd);
        };
    }, [
        playerRef.current,
        playerReady,
        videoId,
        setLoaded,
        setPlayState,
        setMetadata,
        setVolumeState,
        setMuted,
    ]);

    const play = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.play() : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const pause = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.pause() : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const setVolume = useCallback((newVolume) => {
        const { current: player } = playerRef;
        return player !== null ? player.setVolume(newVolume) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const mute = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.setMute(true) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const unmute = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.setMute(false) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const seek = useCallback((time) => {
        const { current: player } = playerRef;
        return player !== null ? player.seek(time) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const { playing } = playState;
    const currentTime = usePlayerCurrentTime(playerRef.current, {
        id: videoId,
        disabled: !playing || timeUpdateInterval === null,
        updateInterval: timeUpdateInterval,
        onUpdate: customOnTimeUpdate,
    });

    return {
        ref: elementRef,
        player: playerRef.current,
        ready,

        play,
        pause,
        mute,
        unmute,
        setVolume,
        seek,
        currentTime,
        loaded,
        muted,
        volume,
        ...metadata,
        ...playState,
    };
}
