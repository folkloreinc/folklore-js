/* globals RadioCanada:true */
import EventEmitter from 'wolfy87-eventemitter';

let loading = false;
let loaded = false;
const events = new EventEmitter();

const loadPlayer = opts => new Promise((resolve) => {
    if (!loaded && typeof RadioCanada !== 'undefined' && typeof RadioCanada.player !== 'undefined') {
        loaded = true;
    }
    if (loaded) {
        resolve(RadioCanada.player);
        return;
    }

    events.once('loaded', resolve);

    if (loading) {
        return;
    }
    loading = true;

    const options = {
        clientId: 'radiocanadaca_tele',
        url: '//services.radio-canada.ca/media/player/client/{clientId}',
        ...opts,
    };
    const script = document.createElement('script');
    script.onload = () => {
        loaded = true;
        events.emit('loaded', RadioCanada.player);
    };
    script.src = options.url.replace(/\{\s*clientId\s*\}/gi, options.clientId);
    document.getElementsByTagName('head')[0].appendChild(script);
});

export default loadPlayer;
