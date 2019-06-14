import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../lib/PropTypes';
import MainLayout from './layouts/Main';
import HomePage from './pages/Home';
import ErrorPage from './pages/Error';

import '<%= getRelativeStylesPath('components/App.jsx', 'main.global.scss') %>';

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
};

const defaultProps = {

};

const App = ({ urlGenerator }) => (
    <MainLayout>
        <Switch>
            <Route exact path={urlGenerator.route('home')} component={HomePage} />
            <Route path="*" component={ErrorPage} />
        </Switch>
    </MainLayout>
);

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withUrlGenerator()(App);
