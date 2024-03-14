import '@micromag/intl/locale/fr';
import Micromag from '@micromag/viewer';
import React from 'react';
import { useIntl } from 'react-intl';

// import * as AppPropTypes from '../../lib/PropTypes';
import story from '../../micromag/data.json';

import styles from '<%= getRelativeStylesPath('components/pages/Home.jsx', 'pages/home.module.scss') %>';

const propTypes = {
    // intl: AppPropTypes.intl.isRequired,
};

function HomePage() {
    const { locale } = useIntl();
    return (
        <div className={styles.container}>
            <Micromag
                story={story}
                locale={locale}
                // basePath={basePath}
                // memoryRouter
                pathWithIndex
                className={styles.micromag}
            />
        </div>
    );
}

HomePage.propTypes = propTypes;

export default HomePage;
