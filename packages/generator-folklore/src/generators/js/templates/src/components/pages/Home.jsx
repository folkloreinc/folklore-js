import React from 'react';
// import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Helmet from 'react-helmet';

import * as AppPropTypes from '../../lib/PropTypes';

import styles from '<%= getRelativeStylesPath('components/pages/Home.jsx', 'pages/home.scss') %>';

const propTypes = {
    intl: AppPropTypes.intl.isRequired,
};

const HomePage = ({ intl }) => (
    <div className={styles.container}>
        <Helmet>
            <title>
                {intl.formatMessage({
                    id: 'meta.title',
                    defaultMessage: 'Accueil',
                })}
            </title>
        </Helmet>
        <div className={styles.logo} />
    </div>
);

HomePage.propTypes = propTypes;

const WithIntlContainer = injectIntl(HomePage);

export default WithIntlContainer;
