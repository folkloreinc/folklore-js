import createLoader from './createLoader';
import loadScript from './loadScript';

const loadTikTok = createLoader(
    ({ url = 'https://www.tiktok.com/embed.js' } = {}) => loadScript(url),
    () => (typeof window.tiktok !== 'undefined' ? window.tiktok : null),
);

export default loadTikTok;
