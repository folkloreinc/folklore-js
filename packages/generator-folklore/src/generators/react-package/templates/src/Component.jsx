import React, { Component } from 'react';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: null,
};

const <%= componentName %> = ({ className }) => (
    <div
        className={classNames({
            [className]: className !== null,
        })}
    >
        <button type="button" onClick={this.onClickButton}>
            Button
        </button>
    </div>
);

<%= componentName %>.propTypes = propTypes;
<%= componentName %>.defaultProps = defaultProps;

export default <%= componentName %>;
