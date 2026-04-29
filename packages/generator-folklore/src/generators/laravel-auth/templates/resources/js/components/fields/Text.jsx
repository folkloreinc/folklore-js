import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { format as formatValue } from '@buttercup/react-formatted-input';

import * as AppPropTypes from '../../lib/PropTypes';
import { isMessage } from '../../lib/utils';
import FormGroup from './FormGroup';

const propTypes = {
    intl: AppPropTypes.intl.isRequired,
    name: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    placeholder: AppPropTypes.text,
    maxLength: PropTypes.number,
    pattern: PropTypes.string,
    format: PropTypes.arrayOf(
        PropTypes.shape({
            char: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
            repeat: PropTypes.number,
            exactly: PropTypes.string,
        }),
    ),
    disableAutocomplete: PropTypes.bool,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    inputClassName: PropTypes.string,
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.object })]),
    required: PropTypes.bool,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
};

const defaultProps = {
    name: null,
    value: null,
    type: 'text',
    placeholder: null,
    maxLength: null,
    pattern: null,
    format: null,
    min: null,
    max: null,
    disableAutocomplete: false,
    inputClassName: null,
    inputRef: null,
    required: false,
    onChange: null,
    onKeyPress: null,
};

const TextField = ({
    intl,
    name,
    type,
    value,
    placeholder,
    maxLength,
    pattern,
    format,
    min,
    max,
    required,
    disableAutocomplete,
    inputClassName,
    inputRef,
    onChange,
    onKeyPress,
    ...props
}) => (
    <FormGroup name={name} required={required} {...props}>
        <input
            type={type}
            name={name}
            value={format !== null ? formatValue(value || '', format).formatted : value || ''}
            ref={inputRef}
            placeholder={isMessage(placeholder) ? intl.formatMessage(placeholder) : placeholder}
            maxLength={maxLength}
            pattern={pattern}
            min={min}
            max={max}
            required={required}
            autoComplete={disableAutocomplete ? 'no-autofill' : null}
            className={classNames([
                'form-control',
                'text-control',
                {
                    [inputClassName]: inputClassName !== null,
                },
            ])}
            onChange={({ target: { value: newValue } }) => (
                onChange(format !== null ? formatValue(newValue, format).raw : newValue)
            )}
            onKeyPress={onKeyPress}
        />
    </FormGroup>
);

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

const WithIntlContainer = injectIntl(TextField);
export default React.forwardRef((props, ref) => <WithIntlContainer inputRef={ref} {...props} />);
