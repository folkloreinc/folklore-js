import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Switch } from 'wouter';
import { useRoutes } from '@folklore/routes';

// import { useUrlGenerator } from '@folklore/routes';
import MainLayout from './layouts/Main';
// import ErrorPage from './pages/Error';
import HomePage from './pages/Home';

import '<%= getRelativeStylesPath('components/App.jsx', 'styles.css') %>';

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

export default Routes;
