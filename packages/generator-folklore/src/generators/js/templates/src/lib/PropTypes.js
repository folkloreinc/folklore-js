import PropTypes from 'prop-types';

/**
 * Core
 */
export const urlGenerator = PropTypes.shape({
    route: PropTypes.func.isRequired,
});

export const intl = PropTypes.shape({
    locale: PropTypes.string.isRequired,
    formatMessage: PropTypes.func.isRequired,
});

/**
 * Site
 */
