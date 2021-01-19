/* eslint-disable no-underscore-dangle, no-param-reassign */
/**
 * Detect Element Resize
 *
 * https://github.com/sdecima/javascript-detect-element-resize
 * Sebastian Decima
 *
 * version: 0.5.3
 */

const { attachEvent = null } = typeof document !== 'undefined' ? document || {} : {};
let stylesCreated = false;

const requestFrame = (() => {
    const raf =
        (typeof window !== 'undefined'
            ? window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame
            : null) || ((fn) => setTimeout(fn, 20));
    return (fn) => raf(fn);
})();

const cancelFrame = (() => {
    const cancel =
        (typeof window !== 'undefined'
            ? window.cancelAnimationFrame ||
              window.mozCancelAnimationFrame ||
              window.webkitCancelAnimationFrame
            : null) || clearTimeout;
    return (id) => cancel(id);
})();

const resetTriggers = (element) => {
    const triggers = element.__resizeTriggers__;
    const expand = triggers.firstElementChild;
    const contract = triggers.lastElementChild;
    const expandChild = expand.firstElementChild;
    contract.scrollLeft = contract.scrollWidth;
    contract.scrollTop = contract.scrollHeight;
    expandChild.style.width = `${expand.offsetWidth + 1}px`;
    expandChild.style.height = `${expand.offsetHeight + 1}px`;
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
};

const scrollListener = (e) => {
    const element = e.currentTarget;
    resetTriggers(element);
    if (element.__resizeRAF__) cancelFrame(element.__resizeRAF__);
    element.__resizeRAF__ = requestFrame(() => {
        const { offsetWidth, offsetHeight } = element;
        if (
            offsetWidth !== element.__resizeLast__[0] ||
            offsetHeight !== element.__resizeLast__[1]
        ) {
            element.__resizeLast__[0] = offsetWidth;
            element.__resizeLast__[1] = offsetHeight;
            element.__resizeListeners__.forEach((fn) => {
                fn.call(element, e);
            });
        }
    });
};

/* Detect CSS Animations support to detect element display/re-attach */
let animation = false;
let keyframeprefix = '';
let animationstartevent = 'animationstart';
const domPrefixes = 'Webkit Moz O ms'.split(' ');
const startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(
    ' ',
);
let pfx = '';

const elm = typeof document !== 'undefined' ? document.createElement('fakeelement') : null;
if (elm !== null && typeof elm.style.animationName !== 'undefined') {
    animation = true;
}

if (animation === false) {
    for (let i = 0; i < domPrefixes.length; i += 1) {
        if (elm !== null && typeof elm.style[`${domPrefixes[i]}AnimationName`] !== 'undefined') {
            pfx = domPrefixes[i];
            keyframeprefix = `-${pfx.toLowerCase()}-`;
            animationstartevent = startEvents[i];
            animation = true;
            break;
        }
    }
}

const animationName = 'resizeanim';
const animationKeyframes = `@${keyframeprefix}keyframes ${animationName} { from { opacity: 0; } to { opacity: 0; } } `;
const animationStyle = `${keyframeprefix}animation: 1ms ${animationName}; `;

const createStyles = () => {
    if (!stylesCreated) {
        // opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
        const css = `
            ${animationKeyframes || ''}
            .resize-triggers { ${animationStyle || ''}visibility: hidden; opacity: 0; }
            .resize-triggers,
            .resize-triggers > div,
            .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; }
            .resize-triggers > div { background: #eee; overflow: auto; }
            .contract-trigger:before { width: 200%; height: 200%; }
        `;
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
        stylesCreated = true;
    }
};

const addResizeListener = (element, fn) => {
    if (attachEvent) {
        element.attachEvent('onresize', fn);
    } else {
        if (!element.__resizeTriggers__) {
            if (getComputedStyle(element).position === 'static') {
                element.style.position = 'relative';
            }
            createStyles();
            element.__resizeLast__ = [0, 0];
            element.__resizeListeners__ = [];
            element.__resizeTriggers__ = document.createElement('div');
            element.__resizeTriggers__.className = 'resize-triggers';
            element.__resizeTriggers__.innerHTML =
                '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
            element.appendChild(element.__resizeTriggers__);
            resetTriggers(element);
            element.addEventListener('scroll', scrollListener, true);

            /* Listen for a css animation to detect element display/re-attach */
            element.__resizeTriggers__.addEventListener(animationstartevent, (e) => {
                if (e.animationName === animationName) {
                    resetTriggers(element);
                }
            });
        }
        element.__resizeListeners__.push(fn);
    }
};

const removeResizeListener = (element, fn) => {
    if (attachEvent) {
        element.detachEvent('onresize', fn);
    } else {
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
        if (!element.__resizeListeners__.length) {
            element.removeEventListener('scroll', scrollListener);
            element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
        }
    }
};

export { addResizeListener, removeResizeListener };
