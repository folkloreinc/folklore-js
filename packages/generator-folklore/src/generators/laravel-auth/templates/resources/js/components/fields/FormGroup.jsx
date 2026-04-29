/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import * as AppPropTypes from '../../lib/PropTypes';
import { isMessage } from '../../lib/utils';

const propTypes = {
    children: PropTypes.node,

    className: PropTypes.string,
    name: PropTypes.string,
    labelPrefix: AppPropTypes.label,
    label: AppPropTypes.label,
    labelSuffix: AppPropTypes.label,
    errors: AppPropTypes.errors,
    helpText: AppPropTypes.label,
    required: PropTypes.bool,
    requiredSign: PropTypes.node,

    errorReplacements: PropTypes.objectOf(PropTypes.node),

    inputOnly: PropTypes.bool,
};

const defaultProps = {
    children: null,

    className: 'text',
    name: null,
    labelPrefix: null,
    label: null,
    labelSuffix: null,
    errors: [],
    helpText: null,
    required: false,
    requiredSign: '*',

    errorReplacements: null,

    inputOnly: false,
};

class FormGroup extends PureComponent {
    constructor(props) {
        super(props);
        this.renderError = this.renderError.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    renderError(error, key) {
        const { errorReplacements } = this.props;
        if (!error || !error.length) {
            return null;
        }
        let content = error;
        if (errorReplacements !== null && isString(error)) {
            const tagsRegExp = /\{([a-zA-Z_-]+)\}/gi;
            const tagRegExp = /\{([a-zA-Z_-]+)\}/i;
            const tags = error.match(tagsRegExp);
            if (tags !== null) {
                const replacementTags = tags.filter(
                    it => (errorReplacements[it.replace(tagRegExp, '$1')] || null) !== null,
                );
                /* eslint-disable react/no-array-index-key */
                content = error
                    .split(new RegExp(`(${replacementTags.join('|')})`))
                    .map((it, index) => (it.match(tagRegExp) !== null ? (
                        React.cloneElement(errorReplacements[it.replace(tagRegExp, '$1')], {
                            key: `error-part-${index}`,
                        })
                    ) : (
                        <span key={`error-part-${index}`}>{it}</span>
                    )));
                /* eslint-enable react/no-array-index-key */
            }
        }
        return (
            <span key={`error_${key}`} className="invalid-feedback" style={{ display: 'block' }}>
                {content}
            </span>
        );
    }

    renderErrors() {
        const { errors } = this.props;
        if (!errors || errors.length < 1) {
            return null;
        }
        const items = isArray(errors) ? errors : [errors];
        return items.map(this.renderError).filter(it => it !== null);
    }

    renderHelp() {
        const { helpText } = this.props;
        if (helpText === null) {
            return null;
        }
        return (
            <small className="form-text text-muted">
                {isMessage(helpText) ? <FormattedHTMLMessage {...helpText} /> : helpText}
            </small>
        );
    }

    renderLabel() {
        const {
            label, labelPrefix, labelSuffix, name, required, requiredSign,
        } = this.props;

        const content = isMessage(label) ? <FormattedMessage {...label} /> : label;

        if (content === null && labelPrefix === null && labelSuffix == null) {
            return null;
        }

        return (
            <div className="form-group-label">
                {isMessage(labelPrefix) ? <FormattedMessage {...labelPrefix} /> : labelPrefix}
                <label htmlFor={name} className="control-label">
                    {content}
                    {required && requiredSign !== null ? (
                        <span className="control-label-sign">{requiredSign}</span>
                    ) : null}
                </label>
                {isMessage(labelSuffix) ? <FormattedMessage {...labelSuffix} /> : labelSuffix}
            </div>
        );
    }

    render() {
        const {
            children, className, inputOnly, errors,
        } = this.props;

        if (inputOnly) {
            return children;
        }

        return (
            <div
                className={classNames([
                    'form-group',
                    {
                        'has-error': errors !== null && !isEmpty(errors),
                        [className]: className !== null,
                    },
                ])}
            >
                {this.renderLabel()}
                <div className="form-group-inner">
                    {children}
                    {this.renderErrors()}
                    {this.renderHelp()}
                </div>
            </div>
        );
    }
}

FormGroup.propTypes = propTypes;
FormGroup.defaultProps = defaultProps;

export default FormGroup;
