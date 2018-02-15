import React from 'react';
import ReactDOM from 'react-dom';
import domready from 'domready';
import { load as loadHypernova } from 'hypernova';
<% if (!options['hot-reload']) { %>import HypernovaComponents from './hypernova';
<% } %>

const FastClick = require('fastclick');
<% if (options['hot-reload']) { %>let HypernovaComponents = require('./hypernova').default;
<% } %>
domready(() => {
    const findComponent = name => HypernovaComponents[name] || null;

    const renderReact = (el, componentName, props) => {
        const Component = findComponent(componentName);
        if (Component === null) {
            console.warn(`Component ${componentName} not found.`);
            return;
        }
        const element = React.createElement(Component, props);
        ReactDOM.render(element, el);
    };

    const renderHypernovaElements = (elements) => {
        Array.prototype.slice.call(elements).forEach((el) => {
            const componentName = el.dataset ? el.dataset.hypernovaKey : el.getAttribute('data-hypernova-key');
            const nodes = loadHypernova(componentName);
            nodes.forEach(({ node, data }) => {
                const props = {
                    ...data,
                };
                renderReact(node, componentName, props);
            });
        });
    };

    FastClick.attach(document.body);

    const hypernovaElements = document.querySelectorAll('div[data-hypernova-key]');
    renderHypernovaElements(hypernovaElements);<%
    if (options['hot-reload']) { %>
    if (__DEV__) {
        // Hot reloading
        if (module.hot) {
            module.hot.accept([
                './hypernova',
            ], () => {
                HypernovaComponents = require('./hypernova').default; // eslint-disable-line global-require
                renderHypernovaElements(hypernovaElements);
            });
        }
    }<% } %>
});
