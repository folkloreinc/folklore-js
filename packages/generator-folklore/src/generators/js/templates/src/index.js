import React from 'react';
import ReactDOM from 'react-dom';
import domready from 'domready';
import { load as loadHypernova } from 'hypernova';
import FastClick from 'fastclick';

let HypernovaComponents = require('./hypernova').default;

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
    renderHypernovaElements(hypernovaElements);

    // Webpack Hot Module Replacement API
    if (module.hot) {
        module.hot.accept('./hypernova.js', () => {
            // eslint-disable-next-line
            HypernovaComponents = require('./hypernova').default;
            renderHypernovaElements(hypernovaElements);
        });
    }
});
