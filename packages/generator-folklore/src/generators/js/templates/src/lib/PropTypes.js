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

export const message = PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string,
});

export const label = PropTypes.oneOfType([
    message,
    PropTypes.node,
]);

/**
 * Site
 */
