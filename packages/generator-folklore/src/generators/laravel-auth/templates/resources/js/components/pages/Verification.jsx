import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import { withUrlGenerator } from '@folklore/react-container';

import * as AppPropTypes from '../../lib/PropTypes';
import PageMeta from '../partials/PageMeta';
import Envelope from '../partials/Envelope';
import SuccessMessage from '../messages/Success';
import Button from '../buttons/Button';

import styles from '../../../styles/pages/verification.scss';

const messages = defineMessages({
    metaTitle: {
        id: 'meta.title_verification',
        defaultMessage: 'Confirmez votre courriel - URBANIA',
    },
    title: {
        id: 'content.verification_title',
        defaultMessage: 'Veuillez confirmer votre courriel',
    },
    description: {
        id: 'content.verification_description',
        defaultMessage:
            'Vous devez cliquer sur le lien de confirmation que nous vous avons envoyé par courriel.',
    },
    button: {
        id: 'content.verification_resend_button',
        defaultMessage: 'Réenvoyer le lien de confirmation',
    },
});

const propTypes = {
    urlGenerator: AppPropTypes.urlGenerator.isRequired,
    resentMessage: PropTypes.string,
};

const defaultProps = {
    resentMessage: null,
};

const ResetPasswordPage = ({ urlGenerator, resentMessage }) => (
    <div className={styles.container}>
        <PageMeta title={messages.metaTitle} />
        <div className={styles.inner}>
            {resentMessage !== null ? (
                <SuccessMessage className={styles.message}>{resentMessage}</SuccessMessage>
            ) : null}
            <div className={styles.content}>
                <h4 className={styles.title}>
                    <FormattedMessage {...messages.title} />
                </h4>
                <p className={styles.description}>
                    <FormattedMessage {...messages.description} />
                </p>
                <div className={styles.actions}>
                    <Button
                        href={urlGenerator.route('auth.verification.resend')}
                        direct
                        label={messages.button}
                    />
                </div>
            </div>
        </div>
    </div>
);

ResetPasswordPage.propTypes = propTypes;
ResetPasswordPage.defaultProps = defaultProps;
const WithStateContainer = connect(({ site }) => ({
    resentMessage: site.messages !== null ? site.messages.verificationResent || null : null,
}))(ResetPasswordPage);
const WithUrlGeneratorContainer = withUrlGenerator()(WithStateContainer);
export default WithUrlGeneratorContainer;
