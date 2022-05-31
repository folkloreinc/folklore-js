import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { loadYouTube } from '@folklore/services';
import createDebug from 'debug';
import usePlayerCurrentTime from './usePlayerCurrentTime';

export const NO_PLAYER_ERROR = new Error('No player');

const debug = createDebug('folklore:video:youtube');

function useYouTubePlayer(
    id,
    {
        width = 0,
        height = 0,
        duration = 0,
        autoplay = false,
        controls = true,
        timeUpdateInterval = 1000,
        muted: initialMuted = false,
        onVolumeChange: customOnVolumeChange = null,
        onTimeUpdate: customOnTimeUpdate = null,
        getVideoId = (url) => {
            if (url === null || url.match(/^https?:/) === null) {
                return url;
            }
            const regExp =
                /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            const match = url.match(regExp);
            return match && match[7].length === 11 ? match[7] : null;
        },
    } = {},
) {
    const [apiLoaded, setApiLoaded] = useState(typeof window.YT !== 'undefined');
    const apiRef = useRef(typeof window.YT !== 'undefined' ? window.YT : null);

    const elementRef = useRef(null);
    const playerRef = useRef(null);
    const playerElementRef = useRef(elementRef.current);
    const elementHasChanged = elementRef.current !== playerElementRef.current;

    const videoId = useMemo(() => getVideoId(id), [id]);

    const [ready, setReady] = useState(false);
    const [muted, setMuted] = useState(initialMuted);
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

    useEffect(() => {
        let canceled = false;
        if (!apiLoaded && videoId !== null) {
            debug('Load API');
            loadYouTube().then((api) => {
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
    }, [apiLoaded, videoId, setApiLoaded]);

    const play = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null && typeof player.playVideo !== 'undefined'
            ? Promise.resolve(player.playVideo())
            : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const pause = useCallback(() => {
        const { current: player } = playerRef;
        return player !== null && typeof player.pauseVideo !== 'undefined'
            ? Promise.resolve(player.pauseVideo())
            : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const setVolume = useCallback(
        (volume) => {
            const { current: player } = playerRef;
            const promise =
                player !== null && typeof player.setVolume !== 'undefined'
                    ? Promise.resolve(player.setVolume(volume * 100))
                    : Promise.reject(NO_PLAYER_ERROR);
            if (customOnVolumeChange) {
                customOnVolumeChange(volume);
            }
            return promise;
        },
        [customOnVolumeChange],
    );

    const mute = useCallback(() => {
        const { current: player } = playerRef;
        return (
            player !== null && typeof player.mute !== 'undefined'
                ? Promise.resolve(player.mute())
                : Promise.reject(NO_PLAYER_ERROR)
        ).then(() => setMuted(true));
    }, [setMuted]);

    const unmute = useCallback(() => {
        const { current: player } = playerRef;
        return (
            player !== null && typeof player.unMute !== 'undefined'
                ? Promise.resolve(player.unMute())
                : Promise.reject(NO_PLAYER_ERROR)
        ).then(() => setMuted(false));
    }, []);

    const seek = useCallback((time) => {
        const { current: player } = playerRef;
        return player !== null && typeof player.seekTo !== 'undefined'
            ? Promise.resolve(player.seekTo(time))
            : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const setLoop = useCallback((loop) => {
        const { current: player } = playerRef;
        return player !== null && typeof player.setLoop !== 'undefined'
            ? Promise.resolve(player.setLoop(loop))
            : Promise.reject(NO_PLAYER_ERROR);
    }, []);

    const destroyPlayer = useCallback(() => {
        if (playerRef.current !== null) {
            debug('Unset player');
            playerRef.current = null;
        }
    }, []);

    // Detect iframe switch and destroy player

    useEffect(() => {
        const { current: currentPlayer } = playerRef;
        if (playerElementRef.current !== elementRef.current && currentPlayer !== null) {
            debug('iFrame switched');
            destroyPlayer();
        }
    }, [elementHasChanged]);

    // Create player
    useEffect(() => {
        const { current: YT = null } = apiRef;
        const { current: currentPlayer = null } = playerRef;
        const { current: element = null } = elementRef;
        if (!apiLoaded || videoId === null || element === null) {
            destroyPlayer();
            return;
        }
        let player = currentPlayer;

        if (player !== null && typeof player.loadVideoById !== 'undefined') {
            debug('Switch video [ID: %s]', videoId);
            player.loadVideoById(videoId);
        } else {
            debug('Create player [ID: %s]', videoId);

            const onReady = ({ target }) => {
                player = target;
                playerRef.current = target;
                setReady(true);
                const newDuration = target.getDuration();
                if (newDuration !== metadata.duration) {
                    setMetadata({
                        ...metadata,
                        duration: newDuration,
                    });
                }

                debug('onReady [ID: %s]', videoId);
            };

            const onStateChange = ({ data: state }) => {
                const newState = {
                    playing: state === YT.PlayerState.PLAYING,
                    paused: state === YT.PlayerState.PAUSED,
                    ended: state === YT.PlayerState.ENDED,
                    buffering: state === YT.PlayerState.BUFFERING,
                };
                setPlayState(newState);
                let stateLabel = null;
                if (newState.playing) {
                    stateLabel = 'playing';
                } else if (newState.paused) {
                    stateLabel = 'paused';
                } else if (newState.ended) {
                    stateLabel = 'ended';
                } else if (newState.buffering) {
                    stateLabel = 'buffering';
                } else if (state === -1) {
                    stateLabel = 'not started';
                } else if (state === 0) {
                    stateLabel = 'stopped';
                }
                debug('onStateChange %s [ID: %s]', stateLabel, videoId);
            };

            player = new YT.Player(element, {
                videoId,
                playerVars: {
                    controls,
                    autoplay: autoplay ? 1 : 0,
                    mute: initialMuted,
                    playsinline: true,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                },
                events: {
                    onReady,
                    onStateChange,
                },
            });
        }

        playerRef.current = player;
        playerElementRef.current = element;
    }, [apiLoaded, videoId, elementHasChanged, setPlayState, setReady, setMetadata, destroyPlayer]);

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
        muted,
        loaded: ready,
        ...metadata,
        ...playState,
    };
}

export default useYouTubePlayer;
