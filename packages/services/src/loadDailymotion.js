import createLoader from './createLoader';
import loadScriptWithCallback from './loadScriptWithCallback';

const loadDailymotion = createLoader(
    ({ url = 'https://api.dmcdn.net/all.js', callback = 'dmAsyncInit' } = {}) =>
        loadScriptWithCallback(url, callback),
    () => (typeof window.DM !== 'undefined' ? window.DM : null),
);

export default loadDailymotion;
