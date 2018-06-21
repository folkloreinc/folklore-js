/* globals YT: true */
import { Promise } from 'es6-promise';
import EventEmitter from 'wolfy87-eventemitter';

let loading = false;
const events = new EventEmitter();

const loadYouTube = opts => new Promise((resolve) => {
    if (typeof YT !== 'undefined') {
        resolve(YT);
        return;
    }

    if (loading) {
        events.once('loaded', resolve);
        return;
    }
    loading = true;

    // eslint-disable-next-line
    const options = {
        ...opts,
    };

    const callbackName = 'onYouTubeIframeAPIReady';
    window[callbackName] = () => {
        resolve(YT);
        events.emit('loaded', YT);
    };


    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.getElementsByTagName('head')[0].appendChild(script);
});

export default loadYouTube;
