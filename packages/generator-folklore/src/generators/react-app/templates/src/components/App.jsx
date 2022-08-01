import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';

// import { useUrlGenerator } from '@folklore/routes';
// import * as AppPropTypes from '../lib/PropTypes';
import MainLayout from './layouts/Main';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';

import '<%= getRelativeStylesPath('components/App.jsx', 'styles.scss') %>';

const propTypes = {};

const defaultProps = {};

function App() {
    // const urlGenerator = useUrlGenerator();
    return (
        <Routes>
            <Route
                path="/"
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

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
