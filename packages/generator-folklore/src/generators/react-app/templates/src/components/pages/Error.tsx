import { Link } from 'wouter';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useUrlGenerator } from '@folklore/routes';

import PageMeta from '../partials/PageMeta';

import styles from '<%= getRelativeStylesPath('components/pages/Error.jsx', 'pages/error.module.css') %>';

export const messages = defineMessages({
    metaTitle401: {
        id: 'meta.title_401',
        defaultMessage: 'Error 401',
        description: 'Page title',
    },
    title401: {
        id: 'errors.title_401',
        defaultMessage: 'Error 401',
        description: 'Page title',
    },
    description401: {
        id: 'errors.description_401',
        defaultMessage: 'You are not authorized to access this page.',
        description: 'Page description',
    },

    metaTitle403: {
        id: 'meta.title_403',
        defaultMessage: 'Error 403',
        description: 'Page title',
    },
    title403: {
        id: 'errors.title_403',
        defaultMessage: 'Error 403',
        description: 'Page title',
    },
    description403: {
        id: 'errors.description_403',
        defaultMessage: 'Access to this page is forbidden',
        description: 'Page description',
    },

    metaTitle404: {
        id: 'meta.title_404',
        defaultMessage: 'Error 404',
        description: 'Page title',
    },
    title404: {
        id: 'errors.title_404',
        defaultMessage: 'Error 404',
        description: 'Page title',
    },
    description404: {
        id: 'errors.description_404',
        defaultMessage: 'This page doesn’t exists',
        description: 'Page description',
    },

    metaTitle500: {
        id: 'meta.title_500',
        defaultMessage: 'Error 500',
        description: 'Page title',
    },
    title500: {
        id: 'errors.title_500',
        defaultMessage: 'Error 500',
        description: 'Page title',
    },
    description500: {
        id: 'errors.description_500',
        defaultMessage: 'There was an error',
        description: 'Page description',
    },

    gotoHome: {
        id: 'errors.goto_home',
        defaultMessage: 'Go to home',
        description: 'Link label',
    },
});

function ErrorPage({ statusCode = 404 }: { statusCode?: number }) {
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
                    <Link href={url('home')}>
                        <FormattedMessage {...messages.gotoHome} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
