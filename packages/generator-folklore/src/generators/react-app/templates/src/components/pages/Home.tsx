import { defineMessages } from 'react-intl';

import PageMeta from '../partials/PageMeta';

import styles from '<%= getRelativeStylesPath('components/pages/Home.jsx', 'pages/home.module.css') %>';

const messages = defineMessages({
    metaTitle: {
        defaultMessage: 'Home',
        description: 'Page title'
    },
});

function HomePage () {
    return (
        <div className={styles.container}>
            <PageMeta title={messages.metaTitle} />
            <div className={styles.logo} />
        </div>
    );
}

export default HomePage;
