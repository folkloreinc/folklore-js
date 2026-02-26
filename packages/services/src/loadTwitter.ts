import createLoader from './createLoader';

const loadTwitter = createLoader(
    ({ url = 'https://platform.twitter.com/widgets.js' } = {}) =>
        new Promise((resolve) => {
            const twttr = ((d, s, id) => {
                const fjs = d.getElementsByTagName(s)[0];
                const t = window.twttr || {};
                if (d.getElementById(id)) {
                    resolve(t);
                    return t;
                }
                const js = d.createElement(s);
                js.id = id;
                js.src = url;
                fjs.parentNode.insertBefore(js, fjs);

                /* eslint-disable no-underscore-dangle */
                t._e = [];
                t.ready = (f) => {
                    t._e.push(f);
                };
                /* eslint-enable no-underscore-dangle */
                return t;
            })(document, 'script', 'twitter-wjs');
            twttr.ready(resolve);
            window.twttr = twttr;
        }),
    () =>
        typeof window.twttr !== 'undefined' && typeof window.twttr.widgets !== 'undefined'
            ? window.twttr
            : null,
);

export default loadTwitter;
