import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

const getSizeInPixel = (size, maxSize, opts) => {
    const options = {
        units: [
            '%',
            'em',
            'rem',
        ],
        ...opts,
    };
    let pixelSize;
    if (isNumber(size)) {
        pixelSize = size;
    } else if (isString(size)) {
        const sizeMatches = size.match(/^([-0-9.]+)(%|em|rem|px)$/i);
        if (sizeMatches) {
            const unit = sizeMatches[2].toLowerCase();
            const floatValue = parseFloat(sizeMatches[1]);
            const value = unit === 'rem' || unit === 'em' ? (floatValue * 100) : floatValue;
            pixelSize = options.units.indexOf(unit) !== -1 ? ((value / 100) * maxSize) : value;
        } else {
            pixelSize = !isNaN(parseFloat(size)) ? parseFloat(size) : null;
        }
    } else {
        pixelSize = maxSize;
    }

    return pixelSize;
};

export default getSizeInPixel;
