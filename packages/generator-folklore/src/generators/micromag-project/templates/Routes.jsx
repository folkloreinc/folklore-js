import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Switch } from 'wouter';
import { useRoutes } from '@folklore/routes';

// import { useUrlGenerator } from '@folklore/routes';
// import * as AppPropTypes from '../lib/PropTypes';
import MainLayout from './layouts/Main';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';

import '<%= getRelativeStylesPath('components/App.jsx', 'styles.scss') %>';

const propTypes = {};

const defaultProps = {};

function Routes() {
    const routes = useRoutes() || {};
    return (
        <Switch>
            <Route>
                <MainLayout>
                    <HomePage />
                </MainLayout>
            </Route>
        </Switch>
    );
}

Routes.propTypes = propTypes;
Routes.defaultProps = defaultProps;

export default Routes;
