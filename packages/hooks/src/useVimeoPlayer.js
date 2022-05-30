import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { loadVimeo } from '@folklore/services';
import createDebug from 'debug';
import usePlayerCurrentTime from './usePlayerCurrentTime';

const debug = createDebug('folklore:video:vimeo');

const NO_PLAYER_ERROR = new Error('No player');

const useVimeoPlayer = (
    id,
    {
        width = 0,
        height = 0,
        duration = 0,
        autoplay = false,
        autopause = true,
        byline = false,
        controls = false,
        initialMuted = false,
        timeUpdateInterval = 1000,
        onTimeUpdate: customOnTimeUpdate = null,
        getVideoId = (url) => {
            if (url === null || url.match(/^[0-9]+$/) !== null) {
                return url;
            }
            const match = url.match(/\/[0-9]+/);
            return match !== null ? match[1] : null;
        },
    } = {},
) => {
    const [apiLoaded, setApiLoaded] = useState(false);

    const apiRef = useRef(null);
    const elementRef = useRef(null);
    const playerRef = useRef(null);

    const videoId = useMemo(() => getVideoId(id), [id]);
    const [ready, setReady] = useState(false);
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

    // Load SDK
    useEffect(() => {
        let canceled = false;
        if (!apiLoaded && id !== null) {
            loadVimeo().then((api) => {
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
        return player !== null ? player.setVolume(0) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const unmute = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null ? player.setVolume(1) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const seek = useCallback((time) => {
        const { current: player } = playerRef;
        return player !== null ? player.setCurrentTime(time) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const setLoop = useCallback((loop) => {
        const { current: player } = playerRef;
        return player !== null ? player.setLoop(loop) : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const destroyVideo = useCallback(() => {
        const { current: player } = playerRef;
        if (player !== null) {
            debug('Unload video');
            player.unload();
        }
        if (player !== null) {
            debug('Unset video');
            playerRef.current = null;
        }
    }, []);

    const playerElementRef = useRef(elementRef.current);
    useEffect(() => {
        const { current: currentPlayer } = playerRef;
        if (playerElementRef.current !== elementRef.current && currentPlayer !== null) {
            debug('iFrame switched');
            destroyVideo();
        }
    });

    // Create player
    useEffect(() => {
        const { current: Player = null } = apiRef;
        const { current: currentPlayer = null } = playerRef;
        const { current: element = null } = elementRef;
        if (!apiLoaded || videoId === null || element === null) {
            destroyVideo();
            return;
        }
        let player = currentPlayer;
        if (player === null) {
            debug('Create player [ID: %s]', videoId);
            player = new Player(element, {
                id: videoId,
                autoplay,
                autopause,
                byline,
                controls,
                muted: initialMuted,
                background: !controls,
            });
            player
                .ready()
                .then(() => setReady(true))
                .catch((e) => {
                    debug('ERROR: %o', e);
                });
            playerElementRef.current = element;
        } else {
            debug('Load video [ID: %s]', videoId);
            player.loadVideo(videoId).catch((e) => {
                debug('ERROR: %o', e);
            });
        }

        playerRef.current = player;
    }, [apiLoaded, videoId, elementRef.current, setReady, destroyVideo, setLoaded]);

    // Bind player events
    useEffect(() => {
        const { current: player } = playerRef;
        if (player === null) {
            return () => {};
        }

        let canceled = false;

        const onLoaded = () => {
            Promise.all([
                player.getDuration(),
                player.getVideoWidth(),
                player.getVideoHeight(),
                player.getMuted(),
            ]).then(([newDuration, newWidth, newHeight, newMuted]) => {
                if (canceled) {
                    return;
                }
                const newMetadata = {
                    duration: newDuration,
                    width: newWidth,
                    height: newHeight,
                };
                setMetadata(newMetadata);
                if (newMuted) {
                    setVolumeState(0);
                }
                setLoaded(true);
            });
            debug('onLoaded [ID: %s]', videoId);
        };
        const onPlay = () => {
            setPlayState({
                playing: true,
                paused: false,
                ended: false,
                buffering: false,
            });
            debug('onPlay [ID: %s]', videoId);
            player
                .getMuted()
                .then((newMuted) => {
                    if (!canceled && newMuted) {
                        setVolumeState(0);
                    }
                })
                .catch(() => {});
        };
        const onPause = () => {
            setPlayState({
                playing: false,
                paused: true,
                ended: false,
                buffering: false,
            });
            debug('onPause [ID: %s]', videoId);
        };
        const onVolumeChange = ({ volume: newVolume }) => setVolumeState(newVolume);
        const onEnded = () => {
            setPlayState({
                playing: false,
                paused: false,
                ended: true,
                buffering: false,
            });
        };
        const onBufferStart = () => {
            setPlayState({
                playing: true,
                paused: false,
                ended: false,
                buffering: true,
            });
            debug('onBufferStart [ID: %s]', videoId);
        };
        const onBufferEnded = () => {
            setPlayState({
                playing: true,
                paused: false,
                ended: false,
                buffering: false,
            });
            debug('onBufferStart [ID: %s]', videoId);
        };

        debug('Bind events [ID: %s]', videoId);
        player.on('loaded', onLoaded);
        player.on('play', onPlay);
        player.on('pause', onPause);
        player.on('volumechange', onVolumeChange);
        player.on('ended', onEnded);
        player.on('bufferstart', onBufferStart);
        player.on('bufferend', onBufferEnded);

        return () => {
            canceled = true;
            debug('Unbind events [ID: %s]', videoId);
            player.off('loaded', onLoaded);
            player.off('play', onPlay);
            player.off('pause', onPause);
            player.off('volumechange', onVolumeChange);
            player.off('ended', onEnded);
            player.off('bufferstart', onBufferStart);
            player.off('bufferend', onBufferEnded);
        };
    }, [videoId, playerRef.current, setPlayState, setMetadata, setVolumeState, setLoaded]);

    const { playing } = playState;
    const getCurrentTime = useCallback((p) => p.getCurrentTime(), []);
    const currentTime = usePlayerCurrentTime(playerRef.current, {
        id: videoId,
        disabled: !playing || timeUpdateInterval === null,
        updateInterval: timeUpdateInterval,
        onUpdate: customOnTimeUpdate,
        getCurrentTime,
    });

    return {
        ref: elementRef,
        player: playerRef.current,
        play,
        pause,
        mute,
        unmute,
        setVolume,
        seek,
        setLoop,
        ready,
        currentTime,
        loaded,
        muted: volume === 0,
        volume,
        ...metadata,
        ...playState,
    };
};

export default useVimeoPlayer;
