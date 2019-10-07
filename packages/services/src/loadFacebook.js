/* globals FB: true */
import { Promise } from 'es6-promise';
import EventEmitter from 'wolfy87-eventemitter';

let loading = false;
const events = new EventEmitter();

const loadFacebookScript = (d, s, id, locale) => {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    const js = d.createElement(s);
    js.id = id;
    js.src = `//connect.facebook.net/${locale}/sdk.js`;
    fjs.parentNode.insertBefore(js, fjs);
};

const loadFacebook = opts => new Promise((resolve) => {
    if (typeof FB !== 'undefined') {
        resolve(FB);
        return;
    }

    if (loading) {
        events.once('loaded', resolve);
        return;
    }
    loading = true;

    const options = {
        appId: null,
        locale: 'EN_US',
        autoLogAppEvents: true,
        cookie: true,
        state: true,
        version: 'v2.11',
        ...opts,
    };

    window.fbAsyncInit = () => {
        FB.init({
            ...options,
        });
        FB.AppEvents.logPageView();
        resolve(FB);
        events.emit('loaded', FB);
    };

    loadFacebookScript(document, 'script', 'facebook-jssdk', options.locale);
});

export default loadFacebook;
