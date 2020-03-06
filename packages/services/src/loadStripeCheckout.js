import createLoader from './createLoader';
import loadScript from './loadScript';

const loadStripeCheckout = createLoader(
    ({ url = 'https://checkout.stripe.com/checkout.js' } = {}) => loadScript(url),
    () => (typeof window.StripeCheckout !== 'undefined' ? window.StripeCheckout : null),
);

export default loadStripeCheckout;
