import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router';
// import { useUrlGenerator } from '@folklore/routes';

// import * as AppPropTypes from '../lib/PropTypes';
import MainLayout from './layouts/Main';
import HomePage from './pages/Home';
import ErrorPage from './pages/Error';

import '<%= getRelativeStylesPath('components/Routes.jsx', 'styles.scss') %>';

const propTypes = {
};

const defaultProps = {};

const Routes = () => {
    // const urlGenerator = useUrlGenerator();
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<ErrorPage />} />
            </Route>
        </Routes>
    );
};

Routes.propTypes = propTypes;
Routes.defaultProps = defaultProps;

export default Routes;
