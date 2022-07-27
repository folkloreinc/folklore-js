import React from 'react';
import PropTypes from 'prop-types';

import styles from '<%= getRelativeStylesPath('components/layouts/Main.jsx', 'layouts/main.module.scss') %>';

const propTypes = {
    children: PropTypes.node.isRequired,
};

const defaultProps = {

};

const MainLayout = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

MainLayout.propTypes = propTypes;
MainLayout.defaultProps = defaultProps;

export default MainLayout;
