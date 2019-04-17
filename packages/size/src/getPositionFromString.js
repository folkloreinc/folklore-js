import getSizeInPixel from './getSizeInPixel';

const getPositionFromString = (positionString, width, height, maxWidth, maxHeight, opts) => {
    // eslint-disable-next-line no-unused-vars
    const options = {
        ...opts,
    };

    const positionArray = positionString.split(' ');
    const firstPositionParts = positionArray[0].split(':');
    const secondPositionParts = (positionArray[1] || positionArray[0]).split(':');
    const firstPosition = firstPositionParts[0];
    const secondPosition = secondPositionParts[0];
    const firstPositionValue = firstPositionParts[1] || null;
    const secondPositionValue = secondPositionParts[1] || null;

    const horizontalFirst = firstPosition === 'left'
        || firstPosition === 'right'
        || secondPosition === 'top'
        || secondPosition === 'bottom'
        || (firstPosition === 'center' && secondPosition === 'center');

    const horizontal = horizontalFirst ? firstPosition : secondPosition;
    const vertical = horizontalFirst ? secondPosition : firstPosition;
    const horizontalOffset = getSizeInPixel(
        horizontalFirst ? firstPositionValue || 0 : secondPositionValue || 0,
        maxWidth,
    );
    const verticalOffset = getSizeInPixel(
        horizontalFirst ? secondPositionValue || 0 : firstPositionValue || 0,
        maxHeight,
    );

    const position = {
        x: 0,
        y: 0,
        horizontal,
        vertical,
    };

    const style = {
        position: 'absolute',
        top: 'auto',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
    };

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

    position.style = style;

    return position;
};

export default getPositionFromString;
