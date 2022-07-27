import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
import shouldPolyfill from './polyfills/should';

function getAppProps() {
    return window.props || {};
}

function renderApp(props) {
    const container = document.getElementById('app');
    const app = React.createElement(App, props);
    const root = createRoot(container);
    root.render(app);
}

if (shouldPolyfill()) {
    import('./polyfills/index').then(() => renderApp(getAppProps()));
} else {
    renderApp(getAppProps());
}
