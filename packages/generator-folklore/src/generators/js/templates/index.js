import React from 'react';
import ReactDOM from 'react-dom';
import domready from 'domready';<% if (rootPropsImport !== null) { %>
import defaultRootProps from '<%= rootPropsImport %>';<% } %>

import Root from './components/Root';

<%
    if (rootPropsImport !== null) {
        %>const getRootProps = () => defaultRootProps;<%
    } else {
        %>const getRootProps = () => {
    const propsEl = document.getElementById('root-props');
    return propsEl !== null ? JSON.parse(propsEl.innerHTML) || {} : {};
};<%
    }
%>

const renderRoot = (props) => {
    const rootEl = document.getElementById('root');
    const root = React.createElement(Root, props);
    ReactDOM.render(root, rootEl);
};

const boot = () => {
    const rootProps = getRootProps();

    if (typeof window.Intl === 'undefined') {
        const { locale = 'fr' } = rootProps;
        import(`./vendor/polyfills/intl-${locale}`).then(() => renderRoot(rootProps));
    } else {
        renderRoot(rootProps);
    }
};

const ready = (document.readyState || 'loading') !== 'loading';
if (ready) {
    boot();
} else {
    domready(boot);
}
