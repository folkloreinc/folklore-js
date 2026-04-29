import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Switch } from 'wouter';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../lib/PropTypes';
import LoginPage from './pages/Login';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import VerificationPage from './pages/Verification';
import ErrorPage from './pages/Error';

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
    isLoggedIn: PropTypes.bool,
};

const defaultProps = {
    isLoggedIn: false,
};

const AuthSection = ({ urlGenerator, isLoggedIn }) => (
    <Switch>
        <Route
            exact
            path={urlGenerator.route('auth.login')}
            render={() => (isLoggedIn ? <Redirect to={urlGenerator.route('home')} /> : <LoginPage />)
            }
        />
        <Route
            exact
            path={urlGenerator.route('auth.password.request')}
            render={() => (isLoggedIn ? (
                <Redirect to={urlGenerator.route('home')} />
            ) : (
                <ForgotPasswordPage />
            ))
            }
        />
        <Route
            exact
            path={urlGenerator.route('auth.password.reset')}
            render={({
                match: {
                    params: { token },
                },
            }) => <ResetPasswordPage token={token} />}
        />
        <Route
            exact
            path={urlGenerator.route('auth.verification.notice')}
            render={() => (!isLoggedIn ? (
                <Redirect to={urlGenerator.route('auth.login')} />
            ) : (
                <VerificationPage />
            ))
            }
        />
        <Route path="*" component={ErrorPage} />
    </Switch>
);

AuthSection.propTypes = propTypes;
AuthSection.defaultProps = defaultProps;

const WithStateContainer = connect(({ auth }) => {
    isLoggedIn: auth.user !== null,
})(AuthSection);
const WithUrlGeneratorContainer = withUrlGenerator()(WithStateContainer);
export default WithUrlGeneratorContainer;
