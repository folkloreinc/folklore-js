import queryString from 'query-string';

import createLoader from './createLoader';
import loadScriptWithCallback from './loadScriptWithCallback';

const loadGoogleMaps = createLoader(
    ({
        url = 'https://maps.googleapis.com/maps/api/js',
        locale = 'en',
        key = null,
        apiKey = null,
        libraries = null,
        callback = `onGoogleMapsLoaded_${new Date().getTime()}`,
    } = {}) =>
        loadScriptWithCallback(
            `${url}?${queryString.stringify({
                key: apiKey || key,
                callback,
                libraries: libraries !== null ? libraries.join(',') : null,
                language: locale,
            })}`,
            callback,
        ),
    () =>
        typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined'
            ? window.google
            : null,
);

export default loadGoogleMaps;
