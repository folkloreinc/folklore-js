import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    children: PropTypes.node.isRequired,
};

const MainLayout = (props) => {
    const { children } = props;
    return (
        <div>
            { children }
        </div>
    );
};

MainLayout.propTypes = propTypes;

export default MainLayout;
