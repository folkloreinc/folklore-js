<% if (options['hot-reload']) { %>import { hot } from 'react-hot-loader';
<% } %>import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { createAppContainer } from '@folklore/react-app';

import reducers from '../reducers/index';
import MainLayout from './layouts/Main';
import HomePage from './pages/Home';

const propTypes = {

};

const defaultProps = {

};

const App = () => (
    <MainLayout>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="*" component={HomePage} />
        </Switch>
    </MainLayout>
);

App.propTypes = propTypes;
App.defaultProps = defaultProps;

// Create container
const containerPropTypes = {
    locale: PropTypes.string,
    messages: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
        PropTypes.objectOf(PropTypes.string),
    ]),
};

const containerDefaultProps = {
    locale: 'fr',
    messages: {},
};

const getStoreReducers = () => reducers;

// Get store initial state from props
const getStoreInitialState = () => ({
    // map props to state
});

const AppContainer = createAppContainer({
    propTypes: containerPropTypes,
    defaultProps: containerDefaultProps,
    getStoreReducers,
    getStoreInitialState,
})(App);

<% if (options['hot-reload']) { %>export default hot(module)(AppContainer);<? } else { %>export default AppContainer;<% } %>
