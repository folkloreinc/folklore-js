import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../../lib/PropTypes';
import useForm from '../../lib/useForm';
import TextField from '../fields/Text';
import Button from '../buttons/Button';
import formMessages from './messages';

import styles from '../../../styles/forms/reset-password.scss';

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
    intl: AppPropTypes.intl.isRequired,
    token: PropTypes.string.isRequired,
    errors: AppPropTypes.formErrors,
    className: PropTypes.string,
    onComplete: PropTypes.func,
};

const defaultProps = {
    errors: null,
    className: null,
    onComplete: null,
};

const ForgotPasswordForm = ({
    urlGenerator, token, errors, className, onComplete,
}) => {
    const action = urlGenerator.route('auth.password.update');
    const {
        csrfToken, fields, submit, value, loading,
    } = useForm({
        action,
        fields: ['email', 'password', 'password_confirmation'],
        errors,
        onComplete,
    });
    const onFormSubmit = useCallback(
        (e) => {
            e.preventDefault();
            submit({
                ...value,
                token,
            });
        },
        [submit],
    );
    return (
        <div
            className={classNames([
                styles.container,
                {
                    [className]: className !== null,
                },
            ])}
        >
            <form action={action} method="POST" onSubmit={onFormSubmit}>
                <input type="hidden" name="_token" value={csrfToken} />
                <input type="hidden" name="token" value={token} />

                <TextField type="email" label={formMessages.emailLabel} {...fields.email} />

                <TextField
                    type="password"
                    label={formMessages.passwordLabel}
                    {...fields.password}
                />

                <TextField
                    type="password"
                    label={formMessages.passwordConfirmationLabel}
                    {...fields.password_confirmation}
                />

                <div className={styles.actions}>
                    <Button
                        type="submit"
                        label={formMessages.resetButton}
                        disabled={loading}
                        loading={loading}
                        green
                    />
                </div>
            </form>
        </div>
    );
};

ForgotPasswordForm.propTypes = propTypes;
ForgotPasswordForm.defaultProps = defaultProps;

const WithUrlGeneratorContainer = withUrlGenerator()(ForgotPasswordForm);
const WithIntlContainer = injectIntl(WithUrlGeneratorContainer);
export default WithIntlContainer;
