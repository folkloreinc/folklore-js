import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import { createAppContainer } from '@folklore/react-app';

import reducers from '../reducers/index';
import MainLayout from './layouts/Main';
import HomePage from './pages/Home';
<%
if (options['hot-reload']) { %>
// eslint-disable-next-line
const hot = __DEV__ ? require('react-hot-loader').hot : null;<% } %>

const propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
        PropTypes.objectOf(PropTypes.string),
    ]),
};

const defaultProps = {
    locale: 'fr',
    messages: {},
};

const App = () => (
    <MainLayout>
        <Route path="*" component={HomePage} />
    </MainLayout>
);

App.propTypes = propTypes;
App.defaultProps = defaultProps;

// Create container

const getStoreReducers = () => reducers;

// Get store initial state from props
const getStoreInitialState = () => ({
    // map props to state
});
<% if (options['hot-reload']) { %>
const AppHot = __DEV__ ? hot(module)(App) : App;
const AppContainer = createAppContainer({
    getStoreReducers,
    getStoreInitialState,
})(AppHot);
<% } else { %>
const AppContainer = createAppContainer({
    getStoreReducers,
    getStoreInitialState,
})(App);
<% } %>
export default AppContainer;
