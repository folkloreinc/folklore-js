import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { withUrlGenerator } from '@folklore/react-container';

// import * as AppPropTypes from '../../lib/PropTypes';
import PageMeta from '../partials/PageMeta';
import Envelope from '../partials/Envelope';
import ForgotPasswordForm from '../forms/ForgotPassword';

import styles from '<%= getRelativeStylesPath('components/pages/ForgotPassword.jsx', 'pages/forgot-password.scss') %>';

const messages = defineMessages({
    metaTitle: {
        id: 'meta.title_forgot_password',
        defaultMessage: 'Login',
    },
    title: {
        id: 'content.forgot_password_title',
        defaultMessage: 'Forgot your password',
    },
    description: {
        id: 'content.forgot_password_description',
        defaultMessage: 'Enter your email address to reset your password',
    },
    emailTitle: {
        id: 'content.forgot_password_email_title',
        defaultMessage: 'We have sent you an email',
    },
    emailDescription: {
        id: 'content.forgot_password_email_description',
        defaultMessage: 'It contains a link to reset your password',
    },
});

const propTypes = {
};

const defaultProps = {};

const ForgotPasswordPage = () => {
    const [emailSent, setEmailSent] = useState(false);
    return (
        <div className={styles.container}>
            <PageMeta title={messages.metaTitle} />
            <div className={styles.inner}>
                {emailSent ? (
                    <div className={styles.content}>
                        <h4 className={styles.title}>
                            <FormattedMessage {...messages.emailTitle} />
                        </h4>
                        <p className={styles.description}>
                            <FormattedMessage {...messages.emailDescription} />
                        </p>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <h4 className={styles.title}>
                            <FormattedMessage {...messages.title} />
                        </h4>
                        <p className={styles.description}>
                            <FormattedMessage {...messages.description} />
                        </p>
                        <ForgotPasswordForm
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

ForgotPasswordPage.propTypes = propTypes;
ForgotPasswordPage.defaultProps = defaultProps;

const WithUrlGeneratorContainer = withUrlGenerator()(ForgotPasswordPage);
export default WithUrlGeneratorContainer;
