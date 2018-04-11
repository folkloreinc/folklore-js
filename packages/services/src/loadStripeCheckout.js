/* globals StripeCheckout:true */
import EventEmitter from 'wolfy87-eventemitter';

let loading = false;
let loaded = false;
const events = new EventEmitter();

const loadPlayer = () => new Promise((resolve) => {
    if (loaded || typeof StripeCheckout !== 'undefined') {
        resolve(StripeCheckout);
        return;
    }

    events.once('loaded', resolve);

    if (loading) {
        return;
    }
    loading = true;

    const script = document.createElement('script');
    script.onload = () => {
        loaded = true;
        events.emit('loaded', StripeCheckout);
    };
    script.src = 'https://checkout.stripe.com/checkout.js';
    document.getElementsByTagName('head')[0].appendChild(script);
});

export default loadPlayer;
