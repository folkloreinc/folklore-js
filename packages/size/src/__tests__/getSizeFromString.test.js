import getSizeFromString from '../getSizeFromString';

test('returns width, height and scale', () => {
    const size = getSizeFromString('100% 100%', 100, 100, 200, 200);
    expect(size.width).toEqual(200);
    expect(size.height).toEqual(200);
    expect(size.scale).toEqual(2);
});

test('with percentage', () => {
    const size1 = getSizeFromString('90% 80%', 100, 100, 200, 200);
    expect(size1.width).toEqual(160);
    expect(size1.height).toEqual(160);
    expect(size1.scale).toEqual(1.6);

    const size2 = getSizeFromString('50%', 100, 100, 200, 200);
    expect(size2.width).toEqual(100);
    expect(size2.height).toEqual(100);
    expect(size2.scale).toEqual(1);
});

test('with auto', () => {
    const size1 = getSizeFromString('100% auto', 100, 50, 200, 200);
    expect(size1.width).toEqual(200);
    expect(size1.height).toEqual(null);

    const size2 = getSizeFromString('auto 50%', 100, 50, 200, 200);
    expect(size2.width).toEqual(null);
    expect(size2.height).toEqual(100);
});

test('mix with percentage and pixel', () => {
    const {
        width,
        height,
        scale,
    } = getSizeFromString('100px 100%', 100, 100, 200, 200);
    expect(width).toEqual(100);
    expect(height).toEqual(100);
    expect(scale).toEqual(1);
});

test('with cover', () => {
    const {
        width,
        height,
        scale,
    } = getSizeFromString('cover', 50, 100, 200, 200);
    expect(width).toEqual(200);
    expect(height).toEqual(400);
    expect(scale).toEqual(4);
});
