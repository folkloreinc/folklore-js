import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';<% if (rootPropsImport !== null) { %>
import rootProps from '<%= rootPropsImport %>';<% } %>

const rootEl = document.getElementById('root');
const root = React.createElement(Root<%=rootPropsImport !== null ? ', rootProps' : ''%>);
ReactDOM.render(root, rootEl);
