import React from 'react';
// import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';

// import * as AppPropTypes from '../../lib/PropTypes';
import PageMeta from '../partials/PageMeta';

import styles from '<%= getRelativeStylesPath('components/pages/Home.jsx', 'pages/home.module.scss') %>';

const messages = defineMessages({
    metaTitle: {
        defaultMessage: 'Home',
        description: 'Page title'
    },
});

const propTypes = {
    // intl: AppPropTypes.intl.isRequired,
};

function HomePage () {
    return (
        <div className={styles.container}>
            <PageMeta title={messages.metaTitle} />
            <div className={styles.logo} />
        </div>
    );
}

HomePage.propTypes = propTypes;

export default HomePage;
