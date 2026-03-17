import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
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

function renderApp(props: Props) {
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
