import getSizeInPixel from './getSizeInPixel';

type GetPositionFromStringOptions = {
    relativeToElement?: boolean;
};

type Style = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

type ComputedPosition = {
    x: number;
    y: number;
    horizontal: string;
    vertical: string;
    style: {
        position: 'absolute';
        top: number | 'auto';
        bottom: number | 'auto';
        left: number | 'auto';
        right: number | 'auto';
    };
};

const getPositionFromString = (
    positionString: string,
    width: number,
    height: number,
    maxWidth: number,
    maxHeight: number,
    opts: GetPositionFromStringOptions = {},
): ComputedPosition => {
    const { relativeToElement = false } = opts || {};

    const positionArray = positionString.split(' ');
    const firstPositionParts = positionArray[0].split(':');
    const secondPositionParts = (positionArray[1] || positionArray[0]).split(':');
    const firstPosition = firstPositionParts[0];
    const secondPosition = secondPositionParts[0];
    const firstPositionValue = firstPositionParts[1] || null;
    const secondPositionValue = secondPositionParts[1] || null;

    const horizontalFirst =
        firstPosition === 'left' ||
        firstPosition === 'right' ||
        secondPosition === 'top' ||
        secondPosition === 'bottom' ||
        (firstPosition === 'center' && secondPosition === 'center');

    const horizontal = horizontalFirst ? firstPosition : secondPosition;
    const vertical = horizontalFirst ? secondPosition : firstPosition;
    const horizontalOffset =
        getSizeInPixel(
            horizontalFirst ? firstPositionValue || 0 : secondPositionValue || 0,
            relativeToElement ? width : maxWidth,
        ) || 0;
    const verticalOffset =
        getSizeInPixel(
            horizontalFirst ? secondPositionValue || 0 : firstPositionValue || 0,
            relativeToElement ? height : maxHeight,
        ) || 0;

    const position: ComputedPosition = {
        x: 0,
        y: 0,
        horizontal,
        vertical,
        style: {
            position: 'absolute',
            top: 'auto',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
        },
    };

    const style: Style = {};

    if (horizontal === 'center') {
        position.x = (maxWidth - width) / 2;
        style.left = (maxWidth - width) / 2;
    } else if (horizontal === 'right') {
        position.x = maxWidth - width;
        style.right = 0;
    } else {
        style.left = 0;
    }

    if (horizontal === 'right') {
        position.x -= horizontalOffset;
        style.right += horizontalOffset;
    } else {
        position.x += horizontalOffset;
        style.left += horizontalOffset;
    }

    if (vertical === 'center') {
        position.y = (maxHeight - height) / 2;
        style.top = (maxHeight - height) / 2;
    } else if (vertical === 'bottom') {
        position.y = maxHeight - height;
        style.bottom = 0;
    } else {
        style.top = 0;
    }

    if (vertical === 'bottom') {
        position.y -= verticalOffset;
        style.bottom += verticalOffset;
    } else {
        position.y += verticalOffset;
        style.top += verticalOffset;
    }

    return {
        ...position,
        style: {
            ...position.style,
            ...style,
        },
    };
};

export default getPositionFromString;
