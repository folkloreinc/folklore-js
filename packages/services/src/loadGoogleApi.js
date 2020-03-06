import queryString from 'query-string';

import createLoader from './createLoader';
import loadScriptWithCallback from './loadScriptWithCallback';

const loadGoogleApi = createLoader(
    ({
        url = 'https://apis.google.com/js/api.js',
        callback = `onGoogleApiLoaded_${new Date().getTime()}`,
    } = {}) =>
        loadScriptWithCallback(
            `${url}?${queryString.stringify({
                onLoad: callback,
            })}`,
            callback,
        ),
    () =>
        typeof window.gapi !== 'undefined' && typeof window.gapi.client !== 'undefined'
            ? window.gapi
            : null,
);

export default loadGoogleApi;
