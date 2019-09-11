/* globals DM: true */
import { Promise } from 'es6-promise';
import EventEmitter from 'wolfy87-eventemitter';

let loading = false;
const events = new EventEmitter();

const loadDailymotion = () =>
    new Promise(resolve => {
        if (typeof DM !== 'undefined') {
            resolve(DM);
            return;
        }

        if (loading) {
            events.once('loaded', resolve);
            return;
        }
        loading = true;

        window.dmAsyncInit = () => {
            resolve(DM);
            events.emit('loaded', DM);
        };

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://api.dmcdn.net/all.js`;
        document.getElementsByTagName('head')[0].appendChild(script);
    });

export default loadDailymotion;
