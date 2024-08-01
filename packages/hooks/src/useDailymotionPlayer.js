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
        embedPlayerId = null,
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
        typeof window !== 'undefined' && typeof window.dailymotion !== 'undefined'
            ? window.dailymotion
            : null,
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
    const [currentTime, setCurrentTime] = useState(0);
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
                url:
                    embedPlayerId !== null
                        ? `https://geo.dailymotion.com/libs/player/${embedPlayerId}.js`
                        : 'https://geo.dailymotion.com/libs/player.js',
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
    }, [videoId, apiLoaded, setApiLoaded, embedPlayerId]);

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
            player.loadContent({
                video: videoId,
            });
            debug('Load video [ID: %s]', videoId);
        } else {
            element.id = `dailymotion-player-${videoId}-${Date.now()}`;
            player = dailymotion
                .createPlayer(element.id, {
                    video: videoId,
                    width,
                    height,
                    params: playerParams,
                })
                .then((newPlayer) => {
                    debug('Player ready [ID: %s]', videoId);
                    setPlayerReady(true);
                    playerRef.current = newPlayer;
                });
            debug('Create player [ID: %s]', videoId);
        }
        playerElementRef.current = element;
    }, [
        apiLoaded,
        elementHasChanged,
        videoId,
        width,
        height,
        autoplay,
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
        const { current: dailymotion = null } = apiRef;
        if (player === null) {
            return () => {};
        }

        let currentPlayState = playState;
        let currentMetadata = metadata;

        function onPlaybackReady() {
            setLoaded(true);
            debug('onPlaybackReady [ID: %s]', videoId);
        }

        function onDurationChange({ videoTime, videoDuration }) {
            currentMetadata = {
                ...currentMetadata,
                duration: videoDuration,
            };
            setMetadata(currentMetadata);
            setCurrentTime(videoTime);
            debug('onDurationChange [ID: %s]', videoId);
        }

        function onVolumeChange({ playerIsMuted, playerVolume, videoTime }) {
            setMuted(playerIsMuted);
            setVolumeState(playerVolume);
            setCurrentTime(videoTime);
            debug('onVolumeChange [ID: %s]', videoId);
        }

        function onPlay({ videoTime }) {
            currentPlayState = {
                ...currentPlayState,
                playing: true,
                paused: false,
                ended: false,
            };
            setPlayState(currentPlayState);
            setCurrentTime(videoTime);
            debug('onPlay [ID: %s]', videoId);
        }

        function onPause({ videoTime }) {
            currentPlayState = {
                ...currentPlayState,
                playing: false,
                paused: true,
                ended: false,
            };
            setPlayState(currentPlayState);
            setCurrentTime(videoTime);
            debug('onPause [ID: %s]', videoId);
        }

        function onEnd({ videoTime }) {
            currentPlayState = {
                ...currentPlayState,
                playing: false,
                paused: false,
                ended: true,
            };
            setPlayState(currentPlayState);
            setCurrentTime(videoTime);
            debug('onEnd [ID: %s]', videoId);
        }

        function onPlaying({ videoTime }) {
            currentPlayState = {
                ...currentPlayState,
                buffering: false,
            };
            setPlayState(currentPlayState);
            setCurrentTime(videoTime);
            debug('onPlaying [ID: %s]', videoId);
        }

        function onWaiting({ videoTime }) {
            currentPlayState = {
                ...currentPlayState,
                buffering: true,
            };
            setPlayState(currentPlayState);
            setCurrentTime(videoTime);
            debug('onWaiting [ID: %s]', videoId);
        }

        function onTimeChange({ videoTime }) {
            setCurrentTime(videoTime);
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

        player.on(dailymotion.events.PLAYER_CRITICALPATHREADY, onPlaybackReady);
        player.on(dailymotion.events.VIDEO_DURATIONCHANGE, onDurationChange);
        player.on(dailymotion.events.PLAYER_VOLUMECHANGE, onVolumeChange);
        player.on(dailymotion.events.VIDEO_PLAY, onPlay);
        player.on(dailymotion.events.VIDEO_PAUSE, onPause);
        player.on(dailymotion.events.VIDEO_END, onEnd);
        player.on(dailymotion.events.VIDEO_PLAYING, onPlaying);
        player.on(dailymotion.events.VIDEO_BUFFERING, onWaiting);
        player.on(dailymotion.events.VIDEO_TIMECHANGE, onTimeChange);
        player.on(dailymotion.events.AD_START, onAdStart);
        player.on(dailymotion.events.AD_END, onAdEnd);

        return () => {
            player.off(dailymotion.events.PLAYER_CRITICALPATHREADY, onPlaybackReady);
            player.off(dailymotion.events.VIDEO_DURATIONCHANGE, onDurationChange);
            player.off(dailymotion.events.PLAYER_VOLUMECHANGE, onVolumeChange);
            player.off(dailymotion.events.VIDEO_PLAY, onPlay);
            player.off(dailymotion.events.VIDEO_PAUSE, onPause);
            player.off(dailymotion.events.VIDEO_END, onEnd);
            player.off(dailymotion.events.VIDEO_PLAYING, onPlaying);
            player.off(dailymotion.events.VIDEO_BUFFERING, onWaiting);
            player.off(dailymotion.events.VIDEO_TIMECHANGE, onTimeChange);
            player.off(dailymotion.events.AD_START, onAdStart);
            player.off(dailymotion.events.AD_END, onAdEnd);
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
