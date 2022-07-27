import { shouldPolyfill as shouldPolyfillLocale } from '@formatjs/intl-locale/should-polyfill';
import { shouldPolyfill as shouldPolyfillPlural } from '@formatjs/intl-pluralrules/should-polyfill';

function should() {
    return (
        typeof window.Intl === 'undefined' ||
        shouldPolyfillLocale() ||
        shouldPolyfillPlural() ||
        typeof window.IntersectionObserver === 'undefined' ||
        typeof window.ResizeObserver === 'undefined'
    );
}

export default should;
