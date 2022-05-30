import { useEffect } from 'react';
import useDailymotionPlayer from './useDailymotionPlayer';
import useYouTubePlayer from './useYouTubePlayer';
import useVimeoPlayer from './useVimeoPlayer';
import useNativeVideoPlayer from './useNativeVideoPlayer';

function useVideoPlayer(params) {
    const {
        service = null,
        videoId = null,
        url = null,
        onLoaded: customOnLoaded = null,
        onPlay: customOnPlay = null,
        onPause: customOnPause = null,
        onEnd: customOnEnd = null,
        onMetadataChange: customOnMetadataChange = null,
        onBufferStart: customOnBufferStart = null,
        onBufferEnded: customOnBufferEnded = null,
    } = params || {};
    const dailymotionPlayer = useDailymotionPlayer(
        service === 'dailymotion' ? videoId || url : null,
        params,
    );
    const youtubePlayer = useYouTubePlayer(service === 'youtube' ? videoId || url : null, params);
    const vimeoPlayer = useVimeoPlayer(service === 'vimeo' ? videoId || url : null, params);
    const nativePlayer = useNativeVideoPlayer(url, params);

    let player = null;
    if (service === 'dailymotion') {
        player = dailymotionPlayer;
    } else if (service === 'youtube') {
        player = youtubePlayer;
    } else if (service === 'vimeo') {
        player = vimeoPlayer;
    } else {
        player = nativePlayer;
    }

    const {
        playing = false,
        paused = false,
        buffering = false,
        ended = false,
        ready = false,
        width: metaWidth = null,
        height: metaHeight = null,
        duration: metaDuration = null,
    } = player || {};

    useEffect(() => {
        if (ready && customOnLoaded !== null) {
            customOnLoaded();
        }
    }, [ready, customOnLoaded]);

    useEffect(() => {
        if (playing && customOnPlay !== null) {
            customOnPlay();
        }
    }, [playing, customOnPlay]);

    useEffect(() => {
        if (paused && customOnPause !== null) {
            customOnPause();
        }
    }, [paused, customOnPause]);

    useEffect(() => {
        if (buffering && customOnBufferStart !== null) {
            customOnBufferStart();
        } else if (!buffering && customOnBufferEnded !== null) {
            customOnBufferEnded();
        }
    }, [buffering, customOnBufferStart, customOnBufferEnded]);

    useEffect(() => {
        if (ended && customOnEnd !== null) {
            customOnEnd();
        }
    }, [ended, customOnEnd]);

    useEffect(() => {
        const hasMetadata = metaWidth !== null || metaHeight !== null || metaDuration !== null;
        if (hasMetadata && customOnMetadataChange !== null) {
            customOnMetadataChange({
                width: metaWidth,
                height: metaHeight,
                duration: metaDuration,
            });
        }
    }, [metaWidth, metaHeight, metaDuration, customOnMetadataChange]);

    return player;
}

export default useVideoPlayer;
