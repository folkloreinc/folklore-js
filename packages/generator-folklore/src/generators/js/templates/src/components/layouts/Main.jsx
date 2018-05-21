import React from 'react';
import PropTypes from 'prop-types';

import styles from '<%= getRelativeStylesPath('components/layouts/Main.jsx', 'layouts/main.scss') %>';

const propTypes = {
    children: PropTypes.node.isRequired,
};

const MainLayout = (props) => {
    const { children } = props;
    return (
        <div className={styles.container}>
            { children }
        </div>
    );
};

MainLayout.propTypes = propTypes;

export default MainLayout;
