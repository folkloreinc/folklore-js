import getPositionFromString from '../getPositionFromString';
import getSizeFromString from '../getSizeFromString';
import getSizeInPixel from '../getSizeInPixel';
import getSizeWithinBounds from '../getSizeWithinBounds';

test('getSizeInPixel returns maxSize for nullish input', () => {
    expect(getSizeInPixel(undefined, 120)).toBe(120);
    expect(getSizeInPixel(null, 80)).toBe(80);
});

test('getSizeInPixel keeps absolute value when unit is excluded from relative units', () => {
    expect(getSizeInPixel('2rem', 16, { units: ['%'] })).toBe(200);
});

test('getSizeFromString resolves auto values when autoIsNull is false', () => {
    expect(getSizeFromString('auto auto', 50, 25, 200, 100, { autoIsNull: false })).toEqual({
        width: 50,
        height: 25,
    });
});

test('getSizeFromString rounds forced pixel values', () => {
    expect(
        getSizeFromString('75.6px 10.2px', 10, 10, 500, 500, { force: true, round: true }),
    ).toEqual({
        width: 76,
        height: 10,
    });
});

test('getPositionFromString computes offsets relative to element dimensions', () => {
    const position = getPositionFromString('left:10% top:10%', 100, 50, 200, 100, {
        relativeToElement: true,
    });

    expect(position.x).toBe(10);
    expect(position.y).toBe(5);
});

test('getSizeWithinBounds returns safe fallback for invalid input dimensions', () => {
    expect(getSizeWithinBounds(0, 100, 200, 200)).toEqual({
        width: 0,
        height: 0,
        ratio: 1,
    });
});
