/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import slugify from 'slugify';
import LocalizedField from '@panneau/field-localized';
import { useFormValue } from '@panneau/core/contexts';

const propTypes = {
    value: PropTypes.objectOf(PropTypes.string),
    locales: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
    value: null,
    locales: null,
};

const PageSlugField = ({ value, locales, ...props }) => {
    const page = useFormValue();
    const { title = null } = page || {};
    const finalValue = useMemo(
        () =>
            locales.reduce(
                (newValue, key) =>
                    newValue === null || isEmpty(newValue[key])
                        ? {
                              ...newValue,
                              [key]: slugify(get(title, key, '')),
                          }
                        : newValue,
                value,
            ),
        [locales, value, title],
    );
    return <LocalizedField value={finalValue} locales={locales} {...props} />;
};

PageSlugField.propTypes = propTypes;
PageSlugField.defaultProps = defaultProps;

export default PageSlugField;
