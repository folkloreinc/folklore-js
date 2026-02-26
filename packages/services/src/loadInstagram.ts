import createLoader from './createLoader';
import loadScript from './loadScript';

const loadInstagram = createLoader(
    ({ url = 'https://www.instagram.com/embed.js' } = {}) => loadScript(url),
    () => (typeof window.instgrm !== 'undefined' ? window.instgrm : null),
);

export default loadInstagram;
