import getComponentFromName from '../getComponentFromName';
import getDisplayName from '../getDisplayName';
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

test('getComponentFromName returns matching component from string key', () => {
    const HeroComponent = { id: 'hero' };
    const components = {
        HeroBanner: HeroComponent,
    };

    expect(getComponentFromName(components, 'hero-banner')).toBe(HeroComponent);
});

test('getComponentFromName falls back to default component name', () => {
    const DefaultComponent = { id: 'default' };
    const components = {
        DefaultCard: DefaultComponent,
    };

    expect(getComponentFromName(components, 'unknown', 'default-card')).toBe(DefaultComponent);
    expect(getComponentFromName(components, null, 'default-card')).toBe(DefaultComponent);
    expect(getComponentFromName(components, null, DefaultComponent)).toBe(DefaultComponent);
});

test('getDisplayName prefers displayName then name then Component', () => {
    expect(getDisplayName({ displayName: 'Primary', name: 'Fallback' })).toBe('Primary');
    expect(getDisplayName({ name: 'Fallback' })).toBe('Fallback');
    expect(getDisplayName({})).toBe('Component');
});

test('isTouchScreen returns null when navigator is unavailable', () => {
    setNavigator(undefined);
    expect(isTouchScreen()).toBe(null);
});

test('isTouchScreen uses navigator.maxTouchPoints when available', () => {
    setNavigator({ maxTouchPoints: 2, userAgent: 'Desktop Browser' });
    expect(isTouchScreen()).toBe(true);

    setNavigator({ maxTouchPoints: 0, userAgent: 'Desktop Browser' });
    expect(isTouchScreen()).toBe(false);
});

test('isTouchScreen falls back to coarse pointer media query', () => {
    setNavigator({ userAgent: 'Desktop Browser' });
    setMatchMedia((query) => ({ media: query, matches: true }));

    expect(isTouchScreen()).toBe(true);
});
