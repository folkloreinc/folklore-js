import getSizeInPixel from './getSizeInPixel';
import getSizeWithinBounds from './getSizeWithinBounds';

const getSizeFromString = (size, width, height, maxWidth, maxHeight, opts) => {
    const {
        force = false,
        autoIsNull = true,
        round = false,
        cover = false,
    } = {
        ...opts,
    };

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
            returnSize = force
                ? {
                      width: widthPixel,
                      height: heightPixel,
                  }
                : getSizeWithinBounds(width, height, widthPixel, heightPixel, {
                      cover,
                  });
        } else if (widthPixel !== null) {
            returnSize.width = widthPixel;
            if (sizeHeight === 'auto') {
                const relativeHeight = ratio !== 0 ? returnSize.width / ratio : 0;
                returnSize.height = !autoIsNull ? relativeHeight : null;
            } else {
                returnSize.height = sizeHeight;
            }
        } else if (heightPixel !== null) {
            returnSize.height = heightPixel;
            if (sizeWidth === 'auto') {
                const relativeWidth = ratio !== 0 ? returnSize.height * ratio : 0;
                returnSize.width = !autoIsNull ? relativeWidth : null;
            } else {
                returnSize.width = sizeWidth;
            }
        } else {
            if (sizeWidth === 'auto') {
                returnSize.width = !autoIsNull ? width : null;
            } else {
                returnSize.width = sizeWidth;
            }
            if (sizeHeight === 'auto') {
                returnSize.height = !autoIsNull ? height : null;
            } else {
                returnSize.height = sizeHeight;
            }
        }
    }

    if (returnSize.width !== null && round) {
        returnSize.width = Math.round(returnSize.width);
    }

    if (returnSize.height !== null && round) {
        returnSize.height = Math.round(returnSize.height);
    }

    return returnSize;
};

export default getSizeFromString;
