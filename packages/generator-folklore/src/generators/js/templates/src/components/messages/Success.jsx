/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import * as AppPropTypes from '../../lib/PropTypes';
import { isMessage } from '../../lib/utils';

import styles from '<%= getRelativeStylesPath('components/messages/Success.jsx', 'messages/success.scss') %>';

const propTypes = {
    children: AppPropTypes.text.isRequired,
    className: PropTypes.string,
};

const defaultProps = {
    className: null,
};

const SuccessMessage = ({
    children, className,
}) => (
    <div
        className={classNames([
            styles.container,
            {
                [className]: className !== null,
            },
        ])}
    >
        {isMessage(children) ? <FormattedMessage {...children} /> : children}
    </div>
);

SuccessMessage.propTypes = propTypes;
SuccessMessage.defaultProps = defaultProps;

export default SuccessMessage;
