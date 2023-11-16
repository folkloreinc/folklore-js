import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
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
        <Routes>
            <Route
                path={routes.home || '/'}
                exact
                element={
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                }
            />
            <Route
                path="*"
                element={
                    <MainLayout>
                        <ErrorPage />
                    </MainLayout>
                }
            />
        </Routes>
    );
}

Routes.propTypes = propTypes;
Routes.defaultProps = defaultProps;

export default Routes;
