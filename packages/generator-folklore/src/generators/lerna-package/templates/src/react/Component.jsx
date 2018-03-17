import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: null,
};

class <%= componentName %> extends Component {
    constructor() {
        super(props);

        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton() {
        console.log('clicked');
    }

    render() {
        const { className } = this.props;
        return (
            <div
                className={classNames({
                    [styles.container]: true,
                    [className]: className !== null,
                })}
            >
                <button
                    type="button"
                    onClick={this.onClickButton}
                >Button</button>
            </div>
        )
    }
}

<%= componentName %>.propTypes = propTypes;
<%= componentName %>.defaultProps = defaultProps;

export default <%= componentName %>;
