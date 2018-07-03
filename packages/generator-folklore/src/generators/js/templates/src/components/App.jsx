import React from 'react';
// import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../lib/PropTypes';
import MainLayout from './layouts/Main';
import NotFound from './pages/NotFound';

import '<%= getRelativeStylesPath('components/App.jsx', 'main.global.scss') %>';

const HomePage = Loadable({
    loader: () => import(/* webpackChunkName: "pages/Home" */'./pages/Home'),
    loading: () => null,
});

const renderLayout = PageComponent => (
    <MainLayout>
        <PageComponent />
    </MainLayout>
);

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
};

const defaultProps = {

};

const App = ({ urlGenerator }) => (
    <Switch>
        <Route exact path={urlGenerator.route('home')} render={() => renderLayout(HomePage)} />
        <Route path="*" render={() => renderLayout(NotFound)} />
    </Switch>
);

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withUrlGenerator()(App);
