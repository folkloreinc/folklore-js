import getSizeInPixel from '../getSizeInPixel';

test('size in percentage', () => {
    const size = getSizeInPixel('90%', 100);
    expect(size).toEqual(90);
});

test('size in pixel', () => {
    const size = getSizeInPixel('90px', 100);
    expect(size).toEqual(90);
});

test('size in em', () => {
    const size = getSizeInPixel('2em', 16);
    expect(size).toEqual(32);
});

test('size in rem', () => {
    const size = getSizeInPixel('2rem', 16);
    expect(size).toEqual(32);
});
