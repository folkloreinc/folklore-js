import createLoader from './createLoader';
import loadScript from './loadScript';

const loadGoogleGsi = createLoader(
    ({ url = 'https://accounts.google.com/gsi/client' } = {}) => loadScript(url),
    () => (typeof window.google !== 'undefined' && typeof window.google.accounts !== 'undefined' ? window.google.accounts : null),
);

export default loadGoogleGsi;
