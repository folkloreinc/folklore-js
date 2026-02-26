import { RefObject } from 'react';

export type VideoPlayerMetadata = {
    width?: number | null;
    height?: number | null;
    duration?: number | null;
};

export type VideoPlayerState = {
    playing?: boolean;
    paused?: boolean;
    buffering?: boolean;
    ended?: boolean;
    ready?: boolean;
    loaded?: boolean;
    currentTime?: number;
    volume?: number;
    muted?: boolean;
};

export type VideoPlayerControls = {
    play: () => void;
    pause: () => void;
    seek?: (time: number) => void;
    mute?: () => void;
    unmute?: () => void;
    setVolume: (volume: number) => void;
    setLoop?: (loop: boolean) => void;
};

// {
//     play: () => void;
//     pause: () => void;
//     mute: () => void;
//     unmute: () => void;
//     setVolume: (volume: number) => void;
//     seek: (time: number) => void;
//     currentTime: number;
//     duration: number;
//     muted: boolean;
//     playing: boolean;
//     paused: boolean;
//     ended: boolean;
//     buffering: boolean;
//     ready: boolean;
//     loaded: boolean;
//     width?: number;
//     height?: number;
//     [key: string]: unknown;
// }

export type VideoPlayer<ExternalPlayer = unknown> = VideoPlayerMetadata &
    VideoPlayerState &
    VideoPlayerControls & {
        ref: RefObject<HTMLElement>;
        player?: ExternalPlayer;
    };
