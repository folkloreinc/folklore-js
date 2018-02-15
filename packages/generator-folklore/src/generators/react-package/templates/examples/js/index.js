import React from 'react';
import ReactDOM from 'react-dom';
import domready from 'domready';

import Examples from './examples';

import '../scss/main.global.scss';

domready(() => {
    let exampleIndex = 0;

    const exampleEl = document.getElementById('app');
    function renderExample() {
        const Example = Examples[exampleIndex];
        const example = React.createElement(Example);
        ReactDOM.render(example, exampleEl);
    }

    renderExample();
    document.addEventListener('click', (e) => {
        e.preventDefault();
        exampleIndex = exampleIndex === (Examples.length - 1) ? 0 : (exampleIndex + 1);
        renderExample();
    });
});
