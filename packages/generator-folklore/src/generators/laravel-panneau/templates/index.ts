import React, { type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

import shouldPolyfill from './polyfills/should';

interface Props {
    isPanneau?: boolean;
    [key: string]: unknown;
}

declare global {
    interface Window {
        props?: Props;
    }
}

function getAppProps(): Props {
    return window.props || ({} as Props);
}

function renderApp(Container: ComponentType<Props>, props: Props) {
    const element = document.getElementById('app');
    const container = React.createElement(Container, props);
    const strictMode = React.createElement(React.StrictMode, {}, container);
    const root = createRoot(element);
    root.render(strictMode);
}

function loadContainer({ isPanneau = false }: Props) {
    return isPanneau
        ? import('./components/Panneau').then(({ default: Container }) => Container)
        : import('./components/App').then(({ default: Container }) => Container);
}

const props = getAppProps();

if (shouldPolyfill()) {
    import('./polyfills/index')
        .then(() => loadContainer(props))
        .then((Container) => renderApp(Container, props));
} else {
    loadContainer(props).then((Container) => renderApp(Container, props));
}
