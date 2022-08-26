import React from 'react';
import { createRoot } from 'react-dom/client';

import shouldPolyfill from './polyfills/should';

function getAppProps() {
    return window.props || {};
}

function renderApp(Container, props) {
    const element = document.getElementById('app');
    const container = React.createElement(Container, props);
    const strictMode = React.createElement(React.StrictMode, {}, container);
    const root = createRoot(element);
    root.render(strictMode);
}

function loadContainer({ isPanneau = false }) {
    return isPanneau
        ? import('./components/Panneau')
        : import('./components/Container').then(({ default: Container }) => Container);
}

const props = getAppProps();

if (shouldPolyfill()) {
    import('./polyfills/index')
        .then(() => loadContainer(props))
        .then((Container) => renderApp(Container, props));
} else {
    loadContainer(props).then((Container) => renderApp(Container, props));
}
