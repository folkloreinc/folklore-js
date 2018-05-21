import React from 'react';
// import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Helmet from 'react-helmet';

import * as AppPropTypes from '../../lib/PropTypes';

import styles from '<%= getRelativeStylesPath('components/pages/NotFound.jsx', 'pages/not-found.scss') %>';

const propTypes = {
    intl: AppPropTypes.intl.isRequired,
};

const NodeFoundPage = ({ intl }) => (
    <div className={styles.container}>
        <Helmet>
            <title>
                {intl.formatMessage({
                    id: 'meta.title',
                    defaultMessage: '404',
                })}
            </title>
        </Helmet>
        <h1>404</h1>
    </div>
);

NodeFoundPage.propTypes = propTypes;

const WithIntlContainer = injectIntl(NodeFoundPage);

export default WithIntlContainer;
