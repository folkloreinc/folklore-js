const getSizeWithinBounds = (width, height, maxWidth, maxHeight, opts) => {
    const options = {
        cover: false,
        ...opts,
    };

    if (!width || width <= 0 || !height || height <= 0) {
        return {
            width: 0,
            height: 0,
            ratio: 1,
        };
    }

    const scaleWidth = Math.round(maxWidth || width) / width;
    const scaleHeight = Math.round(maxHeight || height) / height;
    const scale = options.cover
        ? Math.max(scaleWidth, scaleHeight)
        : Math.min(scaleWidth, scaleHeight);

    const computedWidth = Math.round(width * scale);
    const computedHeight = Math.round(height * scale);

    return {
        width: computedWidth,
        height: computedHeight,
        scale,
    };
};

export default getSizeWithinBounds;
