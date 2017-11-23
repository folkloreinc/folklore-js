import getSizeInPixel from './getSizeInPixel';
import getSizeWithinBounds from './getSizeWithinBounds';

const getSizeFromString = (size, width, height, maxWidth, maxHeight, opts) => {
    const options = Object.assign({
        force: false,
        autoIsNull: true,
        round: false,
    }, opts);

    let returnSize = {
        width: maxWidth,
        height: maxHeight,
    };

    const ratio = width / height;

    if (size === 'cover') {
        returnSize = getSizeWithinBounds(width, height, maxWidth, maxHeight, {
            cover: true,
        });
    } else {
        const sizeArray = typeof size === 'string' ? size.split(' ') : size;
        const sizeWidth = sizeArray[0];
        const sizeHeight = sizeArray[1] || sizeWidth;

        const widthPixel = getSizeInPixel(sizeWidth, maxWidth);
        const heightPixel = getSizeInPixel(sizeHeight, maxHeight);
        if (widthPixel !== null && heightPixel !== null) {
            returnSize = options.force ? {
                width: widthPixel,
                height: heightPixel,
            } : getSizeWithinBounds(
                width,
                height,
                widthPixel,
                heightPixel,
            );
        } else if (widthPixel !== null) {
            returnSize.width = widthPixel;
            if (sizeHeight === 'auto') {
                const relativeHeight = ratio !== 0 ? returnSize.width / ratio : 0;
                returnSize.height = !options.autoIsNull ? relativeHeight : null;
            } else {
                returnSize.height = sizeHeight;
            }
        } else if (heightPixel !== null) {
            returnSize.height = heightPixel;
            if (sizeWidth === 'auto') {
                const relativeWidth = ratio !== 0 ? returnSize.height * ratio : 0;
                returnSize.width = !options.autoIsNull ? relativeWidth : null;
            } else {
                returnSize.width = sizeWidth;
            }
        } else {
            if (sizeWidth === 'auto') {
                returnSize.width = !options.autoIsNull ? width : null;
            } else {
                returnSize.width = sizeWidth;
            }
            if (sizeHeight === 'auto') {
                returnSize.height = !options.autoIsNull ? height : null;
            } else {
                returnSize.height = sizeHeight;
            }
        }
    }

    if (returnSize.width !== null && options.round) {
        returnSize.width = Math.round(returnSize.width);
    }

    if (returnSize.height !== null && options.round) {
        returnSize.height = Math.round(returnSize.height);
    }

    return returnSize;
};

export default getSizeFromString;
