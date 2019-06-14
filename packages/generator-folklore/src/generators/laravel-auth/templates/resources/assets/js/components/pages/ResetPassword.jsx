import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../../lib/PropTypes';
import PageMeta from '../partials/PageMeta';
import ResetPasswordForm from '../forms/ResetPassword';
import Button from '../buttons/Button';

import styles from '<%= getRelativeStylesPath('components/pages/ResetPassword.jsx', 'pages/reset-password.scss') %>';

const messages = defineMessages({
    metaTitle: {
        id: 'meta.title_reset_password',
        defaultMessage: 'Reset password',
    },
    title: {
        id: 'content.reset_password_title',
        defaultMessage: 'Reset your password',
    },
    description: {
        id: 'content.reset_password_description',
        defaultMessage: 'Enter your new password',
    },
    confirmationTitle: {
        id: 'content.reset_password_confirmation_title',
        defaultMessage: 'Your password has been resetted',
    },
    confirmationDescription: {
        id: 'content.reset_password_confirmation_description',
        defaultMessage: 'Tye to remember it this time! ;)',
    },
    button: {
        id: 'content.goto_home',
        defaultMessage: 'Go to home',
    },
});

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
    token: PropTypes.string.isRequired,
};

const defaultProps = {};

const ResetPasswordPage = ({ urlGenerator, token }) => {
    const [emailSent, setEmailSent] = useState(false);
    return (
        <div className={styles.container}>
            <PageMeta title={messages.metaTitle} />
            <div className={styles.inner}>
                {emailSent ? (
                    <div className={styles.content}>
                        <h4 className={styles.title}>
                            <FormattedMessage {...messages.confirmationTitle} />
                        </h4>
                        <p className={styles.description}>
                            <FormattedMessage {...messages.confirmationDescription} />
                        </p>
                        <div className={styles.actions}>
                            <Button href={urlGenerator.route('home')} direct>
                                <FormattedMessage {...messages.button} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <h4 className={styles.title}>
                            <FormattedMessage {...messages.title} />
                        </h4>
                        <p className={styles.description}>
                            <FormattedMessage {...messages.description} />
                        </p>
                        <ResetPasswordForm
                            token={token}
                            className={styles.form}
                            onComplete={() => {
                                setEmailSent(true);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

ResetPasswordPage.propTypes = propTypes;
ResetPasswordPage.defaultProps = defaultProps;

const WithUrlGeneratorContainer = withUrlGenerator()(ResetPasswordPage);
export default WithUrlGeneratorContainer;
