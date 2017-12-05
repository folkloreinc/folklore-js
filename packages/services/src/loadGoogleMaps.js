/* globals google: true */
import queryString from 'query-string';
import { Promise } from 'es6-promise';
import EventEmitter from 'wolfy87-eventemitter';

let loading = false;
const events = new EventEmitter();

const loadGoogleMaps = opts => new Promise((resolve) => {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        resolve(google);
        return;
    }

    if (loading) {
        events.once('loaded', resolve);
        return;
    }
    loading = true;

    const options = {
        locale: 'en',
        apiKey: null,
        libraries: null,
        ...opts,
    };

    const timestamp = (new Date()).getTime();
    const callbackName = `initMap_${timestamp}`;
    window[callbackName] = () => {
        resolve(google);
        events.emit('loaded', google);
    };

    const query = queryString.stringify({
        key: options.apiKey,
        callback: callbackName,
        libraries: options.libraries !== null ? options.libraries.join(',') : null,
        language: options.locale,
    });
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?${query}`;
    document.getElementsByTagName('head')[0].appendChild(script);
});

export default loadGoogleMaps;
