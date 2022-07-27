import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Routes as Switch } from 'react-router-dom';

// import { useUrlGenerator } from '@folklore/routes';
// import * as AppPropTypes from '../lib/PropTypes';
import MainLayout from './layouts/Main';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';

const propTypes = {};

const defaultProps = {};

function Routes() {
    // const urlGenerator = useUrlGenerator();
    return (
        <Switch>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Switch>
    );
}

Routes.propTypes = propTypes;
Routes.defaultProps = defaultProps;

export default Routes;
