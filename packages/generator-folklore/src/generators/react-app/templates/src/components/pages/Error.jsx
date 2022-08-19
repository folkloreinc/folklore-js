/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useUrlGenerator } from '@folklore/routes';

// import * as AppPropTypes from '../../lib/PropTypes';
import PageMeta from '../partials/PageMeta';

import styles from '<%= getRelativeStylesPath('components/pages/Error.jsx', 'pages/error.module.scss') %>';

export const messages = defineMessages({
    metaTitle401: {
        id: 'meta.title_401',
        defaultMessage: 'Error 401',
    },
    title401: {
        id: 'errors.title_401',
        defaultMessage: 'Error 401',
    },
    description401: {
        id: 'errors.description_401',
        defaultMessage: 'You are not authorized to access this page.',
    },

    metaTitle403: {
        id: 'meta.title_403',
        defaultMessage: 'Error 403',
    },
    title403: {
        id: 'errors.title_403',
        defaultMessage: 'Error 403',
    },
    description403: {
        id: 'errors.description_403',
        defaultMessage: 'Access to this page is forbidden',
    },

    metaTitle404: {
        id: 'meta.title_404',
        defaultMessage: 'Error 404',
    },
    title404: {
        id: 'errors.title_404',
        defaultMessage: 'Error 404',
    },
    description404: {
        id: 'errors.description_404',
        defaultMessage: 'This page doesn’t exists',
    },

    metaTitle500: {
        id: 'meta.title_500',
        defaultMessage: 'Error 500',
    },
    title500: {
        id: 'errors.title_500',
        defaultMessage: 'Error 500',
    },
    description500: {
        id: 'errors.description_500',
        defaultMessage: 'There was an error',
    },

    gotoHome: {
        id: 'errors.goto_home',
        defaultMessage: 'Go to home',
    },
});

const propTypes = {
    statusCode: PropTypes.number,
};

const defaultProps = {
    statusCode: 404,
};

function ErrorPage({ statusCode }) {
    const url = useUrlGenerator();
    return (
        <div className={styles.container}>
            <PageMeta title={messages[`metaTitle${statusCode || 404}`]} />
            <div className={styles.inner}>
                <h1 className={styles.title}>
                    <FormattedMessage {...messages[`title${statusCode || 404}`]} />
                </h1>
                <p className={styles.description}>
                    <FormattedMessage {...messages[`description${statusCode || 404}`]} />
                </p>
                <div className={styles.actions}>
                    <Link to={url('home')}>
                        <FormattedMessage {...messages.gotoHome} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

ErrorPage.propTypes = propTypes;
ErrorPage.defaultProps = defaultProps;

export default ErrorPage;
