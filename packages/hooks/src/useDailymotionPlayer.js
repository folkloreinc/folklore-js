import { useState, useRef, useEffect, useCallback } from 'react';
import { loadDailymotion } from '@folklore/services';
import createDebug from 'debug';
import usePlayerCurrentTime from './usePlayerCurrentTime';

const noPlayerError = new Error('No player');

const debug = createDebug('folklore:video:youtube');

const useDailymotionPlayer = (id = null, params = {}) => {
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
    } = params;

    const [apiLoaded, setApiLoaded] = useState(typeof window.DM !== 'undefined');
    const [playerReady, setPlayerReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const apiRef = useRef(typeof window.DM !== 'undefined' ? window.DM : null);
    const elementRef = useRef(null);
    const playerRef = useRef(null);
    const ready = apiLoaded && playerReady;

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
        if (!apiLoaded && id !== null) {
            loadDailymotion().then((api) => {
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
    }, [id]);

    // Create or update player
    useEffect(() => {
        const { current: DM = null } = apiRef;
        const { current: currentPlayer = null } = playerRef;
        const { current: element = null } = elementRef;
        if (!apiLoaded || id === null || element === null) {
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
            player.load(id, {
                params: playerParams,
            });
        } else {
            player = DM.player(element, {
                video: id,
                width,
                height,
                params: playerParams,
            });

            playerRef.current = player;
        }
        if (!playerReady) {
            setPlayerReady(true);
        }
    }, [
        apiLoaded,
        elementRef.current,
        id,
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
        }

        function onLoadedMetadata() {
            currentMetadata = {
                ...currentMetadata,
                duration: player.duration,
            };
            setMetadata(currentMetadata);
        }

        function onDurationChange() {
            currentMetadata = {
                ...currentMetadata,
                duration: player.duration,
            };
            setMetadata(currentMetadata);
        }

        function onVolumeChange() {
            setMuted(player.muted);
            setVolumeState(player.volume);
        }

        function onPlay() {
            currentPlayState = {
                ...currentPlayState,
                playing: true,
                paused: false,
                ended: false,
            };
            setPlayState(currentPlayState);
        }

        function onPause() {
            currentPlayState = {
                ...currentPlayState,
                playing: false,
                paused: true,
                ended: false,
            };
            setPlayState(currentPlayState);
        }

        function onEnd() {
            currentPlayState = {
                ...currentPlayState,
                playing: false,
                paused: false,
                ended: true,
            };
            setPlayState(currentPlayState);
        }

        function onPlaying() {
            currentPlayState = {
                ...currentPlayState,
                buffering: false,
            };
            setPlayState(currentPlayState);
        }

        function onWaiting() {
            currentPlayState = {
                ...currentPlayState,
                buffering: true,
            };
            setPlayState(currentPlayState);
        }

        function onAdStart() {
            currentPlayState = {
                ...currentPlayState,
                adPlaying: true,
            };
            setPlayState(currentPlayState);
        }

        function onAdEnd() {
            currentPlayState = {
                ...currentPlayState,
                adPlaying: false,
            };
            setPlayState(currentPlayState);
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
        id,
        setLoaded,
        setPlayState,
        setMetadata,
        setVolumeState,
        setMuted,
    ]);

    const play = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.play() : Promise.reject(noPlayerError);
    }, []);

    const pause = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.pause() : Promise.reject(noPlayerError);
    }, []);

    const setVolume = useCallback((newVolume) => {
        const { current: player } = playerRef;
        return player !== null ? player.setVolume(newVolume) : Promise.reject(noPlayerError);
    }, []);

    const mute = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.setMute(true) : Promise.reject(noPlayerError);
    }, []);

    const unmute = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.setMute(false) : Promise.reject(noPlayerError);
    }, []);

    const seek = useCallback((time) => {
        const { current: player } = playerRef;
        return player !== null ? player.seek(time) : Promise.reject(noPlayerError);
    }, []);

    const { playing } = playState;
    const currentTime = usePlayerCurrentTime(playerRef.current, {
        id,
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
};

export default useDailymotionPlayer;
