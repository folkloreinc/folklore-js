import createLoader from './createLoader';
import loadScript from './loadScript';

const loadPlayer = createLoader(
    ({
        clientId = 'radiocanadaca_tele',
        url = '//services.radio-canada.ca/media/player/client/{clientId}',
    } = {}) => loadScript(url.replace(/\{\s*clientId\s*\}/gi, clientId)),
    () =>
        typeof window.RadioCanada !== 'undefined' &&
        typeof window.RadioCanada.player !== 'undefined'
            ? window.RadioCanada.player
            : null,
);

export default loadPlayer;
