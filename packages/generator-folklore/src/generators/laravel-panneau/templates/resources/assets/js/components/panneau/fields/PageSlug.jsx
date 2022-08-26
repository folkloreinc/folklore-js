/* eslint-disable react/jsx-props-no-spreading */
import { useFormValue } from '@panneau/core/contexts';
import TextField from '@panneau/field-text';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { generatePath } from 'react-router';

const propTypes = {
    fieldLocale: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    routes: PropTypes.objectOf(PropTypes.string).isRequired,
};

const defaultProps = {
    fieldLocale: null,
    value: null,
    className: null,
};

const PageSlugField = ({ routes, fieldLocale, className, value, ...props }) => {
    const page = useFormValue();
    const { parent = null, handle = null } = page || {};
    const { slug: parentSlug } = parent || {};
    const { page: pageRoute = null, page_with_parent: pageWithParentRoute = null } = routes || {};
    let url =
        pageRoute !== null
            ? generatePath(pageRoute, {
                  page: 'REPLACE',
              })
            : null;
    if (parent !== null && pageWithParentRoute !== null) {
        url = generatePath(pageWithParentRoute, {
            parent: parentSlug !== null ? parentSlug[fieldLocale] || null : null,
            page: 'REPLACE',
        });
    }
    if (handle === 'home') {
        url = `/${fieldLocale}`;
    }

    return (
        <TextField
            prepend={
                url !== null
                    ? `${window.location.protocol}//${window.location.host}${url.replace(
                          'REPLACE',
                          '',
                      )}`
                    : null
            }
            className={classNames([
                'flex-nowrap',
                {
                    [className]: className !== null,
                },
            ])}
            value={handle === 'home' ? null : value}
            {...props}
        />
    );
};

PageSlugField.propTypes = propTypes;
PageSlugField.defaultProps = defaultProps;

export default PageSlugField;
