import createLoader from './createLoader';

const loadFacebookScript = (d, s, id, locale, debug = false) => {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    const js = d.createElement(s);
    js.id = id;
    js.src = `//connect.facebook.net/${locale}/sdk${debug ? '/debug' : ''}.js`;
    fjs.parentNode.insertBefore(js, fjs);
};

const loadFacebook = createLoader(
    (opts) =>
        new Promise((resolve) => {
            const options = {
                appId: null,
                locale: 'EN_US',
                autoLogAppEvents: true,
                cookie: true,
                state: true,
                version: 'v12.0',
                debug: false,
                ...opts,
            };

            window.fbAsyncInit = () => {
                window.FB.init({
                    ...options,
                });
                window.FB.AppEvents.logPageView();
                resolve(window.FB);
            };

            loadFacebookScript(document, 'script', 'facebook-jssdk', options.locale, options.debug);
        }),
    () => (typeof window.FB !== 'undefined' ? window.FB : null),
);

export default loadFacebook;
