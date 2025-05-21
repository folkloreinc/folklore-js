import React from 'react';
import PropTypes from 'prop-types';

import styles from '<%= getRelativeStylesPath('components/layouts/Main.jsx', 'layouts/main.module.css') %>';

const propTypes = {
    children: PropTypes.node.isRequired,
};

function MainLayout({ children = null }) {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

MainLayout.propTypes = propTypes;

export default MainLayout;
