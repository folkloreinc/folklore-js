import getDisplayName from '../getDisplayName';

test('prefers displayName then name then Component', () => {
    expect(getDisplayName({ displayName: 'Primary', name: 'Fallback' })).toBe('Primary');
    expect(getDisplayName({ name: 'Fallback' })).toBe('Fallback');
    expect(getDisplayName({})).toBe('Component');
});
