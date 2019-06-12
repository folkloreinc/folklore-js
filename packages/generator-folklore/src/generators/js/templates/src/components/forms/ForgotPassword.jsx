import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../../lib/PropTypes';
import useForm from '../../lib/useForm';
import TextField from '../fields/Text';
import Button from '../buttons/Button';
import formMessages from './messages';

import styles from '../../../styles/forms/forgot-password.scss';

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

const ForgotPasswordForm = ({
    urlGenerator, errors, className, onComplete,
}) => {
    const action = urlGenerator.route('auth.password.email');
    const {
        csrfToken, fields, onSubmit, loading,
    } = useForm({
        action,
        fields: ['email'],
        errors,
        onComplete,
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
                    name="email"
                    label={formMessages.emailLabel}
                    {...fields.email}
                />

                <div className={styles.actions}>
                    <Button
                        type="submit"
                        label={formMessages.sendButton}
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
