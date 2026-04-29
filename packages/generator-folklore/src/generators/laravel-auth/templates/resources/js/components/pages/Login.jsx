import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../../lib/PropTypes';
import { setUser as setUserActions } from '../../actions/AuthActions';
import PageMeta from '../partials/PageMeta';
import Envelope from '../partials/Envelope';
import LoginForm from '../forms/Login';

import styles from '<%= getRelativeStylesPath('components/pages/Login.jsx', 'pages/login.scss') %>';

const messages = defineMessages({
    metaTitle: {
        id: 'meta.title_login',
        defaultMessage: 'Login',
    },
    title: {
        id: 'content.login_title',
        defaultMessage: 'Login',
    },
    description: {
        id: 'content.login_description',
        defaultMessage: 'Enter you credentials to login into your account',
    },
});

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
    setUser: PropTypes.func.isRequired,
};

const defaultProps = {};

const LoginPage = ({ urlGenerator }) => (
    <div className={styles.container}>
        <PageMeta title={messages.metaTitle} />
        <div className={styles.inner}>
            <div className={styles.content}>
                <h4 className={styles.title}>
                    <FormattedMessage {...messages.title} />
                </h4>
                <p className={styles.description}>
                    <FormattedMessage {...messages.description} />
                </p>
                <LoginForm
                    className={styles.form}
                    onComplete={({ loginType = null }) => {
                        window.location.href = urlGenerator.route('home');
                    }}
                />
            </div>
        </div>
    </div>
);

LoginPage.propTypes = propTypes;
LoginPage.defaultProps = defaultProps;

const WithStateContainer = connect(
    ({ auth }) => ({
        user: auth.user,
    }),
    dispatch => ({
        setUser: user => dispatch(setUserActions(user)),
    }),
)(LoginPage);
const WithUrlGeneratorContainer = withUrlGenerator()(WithStateContainer);

export default WithUrlGeneratorContainer;
