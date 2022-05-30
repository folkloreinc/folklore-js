import queryString from 'query-string';

import createLoader from './createLoader';
import loadScriptWithCallback from './loadScriptWithCallback';

const loadGoogleApi = createLoader(
    ({
        url = 'https://apis.google.com/js/api.js',
        callback = `onGoogleApiLoaded_${new Date().getTime()}`,
        withClient = true,
    } = {}) =>
        loadScriptWithCallback(
            `${url}?${queryString.stringify({
                onload: callback,
            })}`,
            callback,
        ).then(() =>
            withClient
                ? new Promise((resolve) => {
                      window.gapi.load('client', resolve);
                  })
                : null,
        ),
    (_, { withClient = true } = {}) =>
        typeof window.gapi !== 'undefined' &&
        (!withClient || typeof window.gapi.client !== 'undefined')
            ? window.gapi
            : null,
);

export default loadGoogleApi;
