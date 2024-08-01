import createLoader from './createLoader';
import loadScript from './loadScript';
import loadScriptWithCallback from './loadScriptWithCallback';

const loadDailymotion = createLoader(
    ({ url = 'https://api.dmcdn.net/all.js', callback = 'dmAsyncInit' } = {}) =>
        callback !== null ? loadScriptWithCallback(url, callback) : loadScript(url),
    () => (typeof window.DM !== 'undefined' ? window.DM : null),
);

export default loadDailymotion;
