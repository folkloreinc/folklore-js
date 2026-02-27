import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
import shouldPolyfill from './polyfills/should';

function getAppProps() {
    return window.props || {};
}

function renderApp(props) {
    const element = document.getElementById('app');
    const app = createElement(App, props);
    const strictMode = createElement(StrictMode, {}, app);
    const root = createRoot(element);
    root.render(strictMode);
}

if (shouldPolyfill()) {
    import('./polyfills/index').then(() => renderApp(getAppProps()));
} else {
    renderApp(getAppProps());
}
