import createLoader from './createLoader';
import loadScriptWithCallback from './loadScriptWithCallback';

const loadYouTube = createLoader(
    ({
        url = 'https://www.youtube.com/iframe_api',
        callbackName = 'onYouTubeIframeAPIReady',
    } = {}) => loadScriptWithCallback(url, callbackName),
    () => (typeof window.YT !== 'undefined' ? window.YT : null),
);

export default loadYouTube;
