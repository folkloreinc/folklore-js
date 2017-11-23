import getSizeWithinBounds from '../getSizeWithinBounds';

test('without cover', () => {
    const size1 = getSizeWithinBounds(100, 50, 200, 200);
    expect(size1.width).toEqual(200);
    expect(size1.height).toEqual(100);
    expect(size1.scale).toEqual(2);

    const size2 = getSizeWithinBounds(50, 100, 200, 200);
    expect(size2.width).toEqual(100);
    expect(size2.height).toEqual(200);
    expect(size2.scale).toEqual(2);
});

test('with cover', () => {
    const size1 = getSizeWithinBounds(100, 50, 200, 200, {
        cover: true,
    });
    expect(size1.width).toEqual(400);
    expect(size1.height).toEqual(200);
    expect(size1.scale).toEqual(4);

    const size2 = getSizeWithinBounds(50, 100, 200, 200, {
        cover: true,
    });
    expect(size2.width).toEqual(200);
    expect(size2.height).toEqual(400);
    expect(size2.scale).toEqual(4);
});
