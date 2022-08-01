import React from 'react';
import { createRoot } from 'react-dom/client';

import Container from './components/Container';
import shouldPolyfill from './polyfills/should';

function getAppProps() {
    return window.props || {};
}

function renderApp(props) {
    const element = document.getElementById('app');
    const container = React.createElement(Container, props);
    const strictMode = React.createElement(React.StrictMode, {}, container);
    const root = createRoot(element);
    root.render(strictMode);
}

if (shouldPolyfill()) {
    import('./polyfills/index').then(() => renderApp(getAppProps()));
} else {
    renderApp(getAppProps());
}
