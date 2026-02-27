import getComponentFromName from '../getComponentFromName';

test('returns matching component from string key', () => {
    const HeroComponent = { id: 'hero' };
    const components = {
        HeroBanner: HeroComponent,
    };

    expect(getComponentFromName(components, 'hero-banner')).toBe(HeroComponent);
});

test('falls back to default component name', () => {
    const DefaultComponent = { id: 'default' };
    const components = {
        DefaultCard: DefaultComponent,
    };

    expect(getComponentFromName(components, 'unknown', 'default-card')).toBe(DefaultComponent);
    expect(getComponentFromName(components, null, 'default-card')).toBe(DefaultComponent);
    expect(getComponentFromName(components, null, DefaultComponent)).toBe(DefaultComponent);
});
