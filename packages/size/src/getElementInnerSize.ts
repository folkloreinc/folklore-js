import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import { pascalCase } from 'pascal-case';

const paddingProps = ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];

const borderProps = ['borderLeftWidth', 'borderRightWidth', 'borderBottomWidth', 'borderTopWidth'];

interface ElementLike extends HTMLElement {
    width?: number;
    height?: number;
}

type StyleLike = CSSStyleDeclaration & Record<string, string | number | undefined>;

type InnerSize = {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
};

const getNumberValue = (value: string | number): number => {
    const matches = isString(value) ? value.match(/^([0-9.]+)/) : false;
    if (matches) {
        return parseFloat(matches[1]);
    }
    return isNumber(value) ? value : 0;
};

const getStyleValue = (style: StyleLike, prop: string): number => getNumberValue(style[prop] || 0);

const parseUnits = (style: StyleLike, prop: string, direction: string): number => {
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
        return getNumberValue(parts[partsCount === 2 ? index % 2 : lastIndex]);
    }
    return getNumberValue(parts[index]);
};

const getStylesValue = (style: StyleLike, direction: string): number => {
    const pascalDirection = pascalCase(direction);
    // Padding
    const padding = paddingProps.filter((prop) => prop.match(new RegExp(`${pascalDirection}`)));
    const paddingsTotal = padding.reduce((total, prop) => total + getStyleValue(style, prop), 0);
    const paddingTotal =
        typeof style.padding !== 'undefined' ? parseUnits(style, 'padding', direction) : 0;
    const paddingSum = paddingTotal || paddingsTotal;

    // Borders
    const borders = borderProps.filter((prop) => prop.match(new RegExp(`${pascalDirection}`)));
    const bordersTotal = borders.reduce((total, prop) => total + getStyleValue(style, prop), 0);
    const borderTotal = getStyleValue(style, 'border');
    const borderSum = borderTotal || bordersTotal;

    return paddingSum + borderSum;
};

const getElementInnerSize = (element: ElementLike, style?: StyleLike): InnerSize => {
    const elementStyle = style || (window.getComputedStyle(element) as StyleLike);
    const elementWidth = element.width || element.offsetWidth || 0;
    const elementHeight = element.height || element.offsetHeight || 0;
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

const getElementInnerWidth = (element: ElementLike, style?: StyleLike): number =>
    getElementInnerSize(element, style).width;

const getElementInnerHeight = (element: ElementLike, style?: StyleLike): number =>
    getElementInnerSize(element, style).height;

export { getElementInnerWidth, getElementInnerHeight, getElementInnerSize };

export default getElementInnerSize;
