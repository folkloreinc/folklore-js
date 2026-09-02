import { useEffect } from 'react';

import useDailymotionPlayer, { UseDailymotionPlayerOptions } from './useDailymotionPlayer';
import useNativeVideoPlayer, { UseNativeVideoPlayerOptions } from './useNativeVideoPlayer';
import useVimeoPlayer, { UseVimeoPlayerOptions } from './useVimeoPlayer';
import useYouTubePlayer, { UseYouTubePlayerOptions } from './useYouTubePlayer';
import { VideoPlayer, VideoPlayerMetadata } from './videoPlayer';

export type UseVideoPlayerOptions = (
    | UseNativeVideoPlayerOptions
    | UseVimeoPlayerOptions
    | UseYouTubePlayerOptions
    | UseDailymotionPlayerOptions
) & {
    service?: 'dailymotion' | 'youtube' | 'vimeo' | 'native' | null;
    videoId?: string | null;
    url?: string | null;
    onLoaded?: (() => void) | null;
    onPlay?: (() => void) | null;
    onPause?: (() => void) | null;
    onEnd?: (() => void) | null;
    onMetadataChange?: ((metadata: VideoPlayerMetadata) => void) | null;
    onBufferStart?: (() => void) | null;
    onBufferEnded?: (() => void) | null;
    [key: string]: unknown;
};

export default function useVideoPlayer({
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
    ...opts
}: UseVideoPlayerOptions = {}): VideoPlayer | null {
    const dailymotionPlayer = useDailymotionPlayer(
        service === 'dailymotion' ? videoId || url : null,
        opts,
    );
    const youtubePlayer = useYouTubePlayer(service === 'youtube' ? videoId || url : null, opts);
    const vimeoPlayer = useVimeoPlayer(service === 'vimeo' ? videoId || url : null, opts);
    const nativePlayer = useNativeVideoPlayer(
        ['dailymotion', 'youtube', 'vimeo'].indexOf(service) === -1 ? url : null,
        opts,
    );

    let player: VideoPlayer | null = null;
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
    }, [playing /* , customOnPlay */]);

    useEffect(() => {
        if (paused && customOnPause !== null) {
            customOnPause();
        }
    }, [paused /* , customOnPause */]);

    useEffect(() => {
        if (buffering && customOnBufferStart !== null) {
            customOnBufferStart();
        } else if (!buffering && customOnBufferEnded !== null) {
            customOnBufferEnded();
        }
    }, [buffering /* , customOnBufferStart, customOnBufferEnded */]);

    useEffect(() => {
        if (ended && customOnEnd !== null) {
            customOnEnd();
        }
    }, [ended /* , customOnEnd */]);

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
