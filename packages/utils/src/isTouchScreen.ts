type NavigatorWithMsTouch = Navigator & {
    msMaxTouchPoints?: number;
};

export default function isTouchScreen(): boolean | null {
    if (typeof navigator === 'undefined') {
        return null;
    }
    const typedNavigator = navigator as NavigatorWithMsTouch;
    let hasTouchScreen = false;
    if ('maxTouchPoints' in typedNavigator) {
        hasTouchScreen = typedNavigator.maxTouchPoints > 0;
    } else if ('msMaxTouchPoints' in typedNavigator) {
        hasTouchScreen = (typedNavigator.msMaxTouchPoints || 0) > 0;
    } else {
        const mQ = matchMedia?.('(pointer:coarse)');
        if (mQ?.media === '(pointer:coarse)') {
            hasTouchScreen = !!mQ.matches;
        } else if ('orientation' in window) {
            hasTouchScreen = true; // deprecated, but good fallback
        } else {
            // Only as a last resort, fall back to user agent sniffing
            const UA = navigator.userAgent;
            hasTouchScreen =
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
        }
    }
    return hasTouchScreen;
}
