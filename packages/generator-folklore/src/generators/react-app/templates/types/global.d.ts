declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.mp3' {
    const value: string;
    export default value;
}

declare module '*.mp4' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    import { type ElementType } from 'react';
    const value: string;
    export default value;
    export const ReactComponent: ElementType;
}

interface Window {
    cioanalytics: {
        [key: string]: unknown;
    };
    cioanalyticsReady?: () => void;
}
