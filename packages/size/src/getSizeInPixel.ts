import isNumber from 'lodash-es/isNumber';
import isString from 'lodash-es/isString';

type SizeUnit = '%' | 'em' | 'rem' | 'px';
type SizeValue = number | string | null | undefined;

type GetSizeInPixelOptions = {
    units?: SizeUnit[];
};

const getSizeInPixel = (
    size: SizeValue,
    maxSize: number,
    opts: GetSizeInPixelOptions = {},
): number | null => {
    const options = {
        units: ['%', 'em', 'rem'],
        ...opts,
    };
    let pixelSize: number | null;
    if (isNumber(size)) {
        pixelSize = size;
    } else if (isString(size)) {
        const sizeMatches = size.match(/^([-0-9.]+)(%|em|rem|px)$/i);
        if (sizeMatches) {
            const unit = sizeMatches[2].toLowerCase();
            const floatValue = parseFloat(sizeMatches[1]);
            const value = unit === 'rem' || unit === 'em' ? floatValue * 100 : floatValue;
            pixelSize = options.units.indexOf(unit) !== -1 ? (value / 100) * maxSize : value;
        } else {
            pixelSize = !Number.isNaN(parseFloat(size)) ? parseFloat(size) : null;
        }
    } else {
        pixelSize = maxSize;
    }

    return pixelSize;
};

export default getSizeInPixel;
