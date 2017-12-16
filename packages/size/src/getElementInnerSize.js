import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import pascalCase from 'pascal-case';

const paddingProps = [
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
];

const borderProps = [
    'borderLeftWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderTopWidth',
];

const getNumberValue = (value) => {
    const matches = isString(value) ? value.match(/^([0-9.]+)/) : false;
    if (matches) {
        return parseFloat(matches[1]);
    }
    return isNumber(value) ? value : 0;
};

const getStyleValue = (style, prop) => getNumberValue(style[prop] || 0);

const parseUnits = (style, prop, direction) => {
    const value = style[prop] || 0;
    if (isNumber(value)) {
        return value;
    }
    const directionIndex = {
        top: 0,
        right: 1,
        bottom: 2,
        left: 3,
    };
    const parts = value.split(' ');
    const partsCount = parts.length;
    if (partsCount === 1) {
        return getNumberValue(parts[0]);
    }
    const index = directionIndex[direction];
    const lastIndex = partsCount - 1;
    if (index > lastIndex) {
        return getNumberValue(parts[partsCount === 2 ? (index % 2) : lastIndex]);
    }
    return getNumberValue(parts[index]);
};

const getStylesValue = (style, direction) => {
    const pascalDirection = pascalCase(direction);
    // Padding
    const padding = paddingProps.filter(prop => prop.match(new RegExp(`${pascalDirection}`)));
    const paddingsTotal = padding.reduce((total, prop) => (
        total + getStyleValue(style, prop)
    ), 0);
    const paddingTotal = typeof style.padding !== 'undefined' ? parseUnits(style, 'padding', direction) : 0;
    const paddingSum = paddingTotal || paddingsTotal;

    // Borders
    const borders = borderProps.filter(prop => prop.match(new RegExp(`${pascalDirection}`)));
    const bordersTotal = borders.reduce((total, prop) => (
        total + getStyleValue(style, prop)
    ), 0);
    const borderTotal = getStyleValue(style, 'border');
    const borderSum = borderTotal || bordersTotal;

    return paddingSum + borderSum;
};

const getElementInnerSize = (element, style) => {
    const elementStyle = style || window.getComputedStyle(element);
    const elementWidth = (element.width || element.offsetWidth || 0);
    const elementHeight = (element.height || element.offsetHeight || 0);
    const left = getStylesValue(elementStyle, 'left');
    const right = getStylesValue(elementStyle, 'right');
    const top = getStylesValue(elementStyle, 'top');
    const bottom = getStylesValue(elementStyle, 'bottom');
    const width = elementWidth - (left + right);
    const height = elementHeight - (top + bottom);
    return {
        width,
        height,
        left,
        right,
        top,
        bottom,
    };
};

const getElementInnerWidth = (element, style) => (
    getElementInnerSize(element, style).width
);

const getElementInnerHeight = (element, style) => (
    getElementInnerSize(element, style).height
);

export {
    getElementInnerWidth,
    getElementInnerHeight,
    getElementInnerSize,
};

export default getElementInnerSize;
