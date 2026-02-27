import isTouchScreen from '../isTouchScreen';

type WindowWithOrientation = Window & {
    orientation?: number;
};

type NavigatorLike = {
    maxTouchPoints?: number;
    msMaxTouchPoints?: number;
    userAgent?: string;
};

const originalNavigator = globalThis.navigator;
const originalMatchMedia = globalThis.matchMedia;
const originalOrientationDescriptor = Object.getOwnPropertyDescriptor(window, 'orientation');

function setNavigator(value: NavigatorLike | undefined): void {
    Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value,
    });
}

function setMatchMedia(
    implementation: ((query: string) => { media: string; matches: boolean }) | undefined,
): void {
    Object.defineProperty(globalThis, 'matchMedia', {
        configurable: true,
        value: implementation,
    });
}

function clearOrientation(): void {
    if (originalOrientationDescriptor) {
        Object.defineProperty(window, 'orientation', originalOrientationDescriptor);
    } else {
        delete (window as WindowWithOrientation).orientation;
    }
}

afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: originalNavigator,
    });

    Object.defineProperty(globalThis, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
    });

    clearOrientation();
});

test('returns null when navigator is unavailable', () => {
    setNavigator(undefined);
    expect(isTouchScreen()).toBe(null);
});

test('uses navigator.maxTouchPoints when available', () => {
    setNavigator({ maxTouchPoints: 2, userAgent: 'Desktop Browser' });
    expect(isTouchScreen()).toBe(true);

    setNavigator({ maxTouchPoints: 0, userAgent: 'Desktop Browser' });
    expect(isTouchScreen()).toBe(false);
});

test('falls back to coarse pointer media query', () => {
    setNavigator({ userAgent: 'Desktop Browser' });
    setMatchMedia((query) => ({ media: query, matches: true }));

    expect(isTouchScreen()).toBe(true);
});
