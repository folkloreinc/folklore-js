import createLoader from './createLoader';
import loadScript from './loadScript';

const loadGoogleIma = createLoader(
    ({ url = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js' } = {}) => loadScript(url),
    () => (typeof window.google !== 'undefined' && typeof window.google.ima !== 'undefined' ? window.google.ima : null),
);

export default loadGoogleIma;
