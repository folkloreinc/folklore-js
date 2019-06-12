import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import * as AppPropTypes from '../../lib/PropTypes';
import useForm from '../../lib/useForm';
import TextField from '../fields/Text';
import Button from '../buttons/Button';
import formMessages from './messages';

import styles from '../../../styles/forms/register.scss';

const messages = defineMessages({
    registerSection: {
        id: 'forms.register.register_section',
        defaultMessage: 'Inscription',
    },
});

const propTypes = {
    intl: AppPropTypes.intl.isRequired,
    action: PropTypes.string.isRequired,
    errors: AppPropTypes.formErrors,
    onComplete: PropTypes.func,
};

const defaultProps = {
    errors: null,
    onComplete: null,
};

const RegisterForm = ({
    intl, action, errors, onComplete,
}) => {
    const { csrfToken, fields, onSubmit } = useForm({
        action,
        fields: ['firstname', 'lastname', 'email', 'password', 'password_confirmation'],
        errors,
        onComplete,
    });
    return (
        <div className={styles.container}>
            <form action={action} method="POST" onSubmit={onSubmit}>
                <input type="hidden" name="_token" value={csrfToken} />

                <fieldset className="form-section">
                    <legend><FormattedMessage {...messages.registerSection} /></legend>
                    <div className={styles.horizontal}>
                        <TextField
                            name="firstname"
                            label={intl.formatMessage(formMessages.firstnameLabel)}
                            className={styles.firstname}
                            {...fields.firstname}
                        />
                        <TextField
                            name="lastname"
                            label={intl.formatMessage(formMessages.lastnameLabel)}
                            className={styles.lastname}
                            {...fields.lastname}
                        />
                    </div>
                    <TextField
                        type="email"
                        name="email"
                        label={intl.formatMessage(formMessages.emailLabel)}
                        {...fields.email}
                    />
                    <div className={styles.horizontal}>
                        <TextField
                            name="password"
                            label={intl.formatMessage(formMessages.passwordLabel)}
                            className={styles.password}
                            {...fields.password}
                        />
                        <TextField
                            name="password_confirmation"
                            label={intl.formatMessage(formMessages.passwordConfirmationLabel)}
                            className={styles.confirmation}
                            {...fields.password_confirmation}
                        />
                    </div>
                </fieldset>

                <div className={styles.actions}>
                    <Button type="submit" label={formMessages.sendButton} />
                </div>
            </form>
        </div>
    );
};

RegisterForm.propTypes = propTypes;
RegisterForm.defaultProps = defaultProps;

const WithIntlContainer = injectIntl(RegisterForm);
export default WithIntlContainer;
