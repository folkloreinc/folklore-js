import PropTypes from 'prop-types';

export const adPath = PropTypes.string;
export const adSize = PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string,
        ]),
    ),
]);
export const adSizeMapping = PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), adSize])),
);

export const adPosition = PropTypes.shape({
    size: adSize,
    sizeMapping: PropTypes.objectOf(adSize),
});

export const adPositions = PropTypes.objectOf(adPosition);

export const adViewports = PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number));

export const adTargeting = PropTypes.shape({
    domain: PropTypes.string,
});
