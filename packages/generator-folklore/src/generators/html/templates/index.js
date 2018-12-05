import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';
import rootProps from './data/root';

const rootEl = document.getElementById('root');
const root = React.createElement(Root, rootProps);
ReactDOM.render(root, rootEl);
