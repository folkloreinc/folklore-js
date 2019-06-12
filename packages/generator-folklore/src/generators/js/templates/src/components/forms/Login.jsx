import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../../lib/PropTypes';
import useForm from '../../lib/useForm';
import TextField from '../fields/Text';
import Button from '../buttons/Button';
import formMessages from './messages';

import styles from '../../../styles/forms/login.scss';

const messages = defineMessages({
    forgotPassword: {
        id: 'content.forgot_password',
        defaultMessage: 'Mot de passe oublié?',
    },
});

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
    intl: AppPropTypes.intl.isRequired,
    errors: AppPropTypes.formErrors,
    className: PropTypes.string,
    onComplete: PropTypes.func,
};

const defaultProps = {
    errors: null,
    className: null,
    onComplete: null,
};

const LoginForm = ({
    urlGenerator, errors, className, onComplete,
}) => {
    const [askPassword, setAskPassword] = useState(null);
    const isVerify = askPassword === null;
    const action = isVerify
        ? urlGenerator.route('auth.prelogin')
        : urlGenerator.route('auth.login');
    const {
        csrfToken, fields, onSubmit, loading,
    } = useForm({
        action,
        fields: ['email', 'password'],
        errors,
        onComplete: (data) => {
            const { loginType = null } = data;
            if (isVerify && loginType === 'password') {
                setAskPassword(true);
            } else {
                onComplete(data);
            }
        },
    });
    return (
        <div
            className={classNames([
                styles.container,
                {
                    [className]: className !== null,
                },
            ])}
        >
            <form action={action} method="POST" onSubmit={onSubmit}>
                <input type="hidden" name="_token" value={csrfToken} />

                <TextField
                    type="email"
                    label={formMessages.emailLabel}
                    {...fields.email}
                />

                {askPassword ? (
                    <TextField
                        type="password"
                        label={formMessages.passwordLabel}
                        className={styles.password}
                        {...fields.password}
                        helpText={(
                            <div className={styles.forgot}>
                                <Link
                                    to={urlGenerator.route('auth.password.request')}
                                    className={styles.link}
                                >
                                    <FormattedMessage {...messages.forgotPassword} />
                                </Link>
                            </div>
                        )}
                    />
                ) : null}

                <div className={styles.actions}>
                    <Button
                        type="submit"
                        label={formMessages.loginButton}
                        disabled={loading}
                        loading={loading}
                        green
                    />
                </div>
            </form>
        </div>
    );
};

LoginForm.propTypes = propTypes;
LoginForm.defaultProps = defaultProps;

const WithUrlGeneratorContainer = withUrlGenerator()(LoginForm);
const WithIntlContainer = injectIntl(WithUrlGeneratorContainer);
export default WithIntlContainer;
