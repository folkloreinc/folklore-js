import getPositionFromString from '../getPositionFromString';

test('return style', () => {
    const position = getPositionFromString('center', 100, 100, 200, 200);
    expect(position.style.position).toEqual('absolute');
    expect(position.style.top).toEqual(50);
    expect(position.style.left).toEqual(50);
    expect(position.style.bottom).toEqual('auto');
    expect(position.style.right).toEqual('auto');
});

test('positioning in center', () => {
    const position1 = getPositionFromString('center center', 100, 100, 200, 200);
    expect(position1.x).toEqual(50);
    expect(position1.y).toEqual(50);

    const position2 = getPositionFromString('center', 100, 100, 200, 200);
    expect(position2.x).toEqual(50);
    expect(position2.y).toEqual(50);
});

test('positioning with offset in pixel', () => {
    const position1 = getPositionFromString('center:10px center:10px', 100, 100, 200, 200);
    expect(position1.x).toEqual(60);
    expect(position1.y).toEqual(60);

    const position2 = getPositionFromString('top:10px left', 100, 100, 200, 200);
    expect(position2.x).toEqual(0);
    expect(position2.y).toEqual(10);

    const position3 = getPositionFromString('bottom:-10px right', 100, 100, 200, 200);
    expect(position3.x).toEqual(100);
    expect(position3.y).toEqual(110);
});

test('positioning with offset in percentage', () => {
    const position1 = getPositionFromString('center:10% center:10%', 100, 100, 200, 200);
    expect(position1.x).toEqual(70);
    expect(position1.y).toEqual(70);

    const position2 = getPositionFromString('top left:10%', 100, 100, 200, 200);
    expect(position2.x).toEqual(20);
    expect(position2.y).toEqual(0);

    const position3 = getPositionFromString('top:10% left:-10%', 100, 100, 200, 200);
    expect(position3.x).toEqual(-20);
    expect(position3.y).toEqual(20);
});

test('style has auto to unsused sides', () => {
    const position1 = getPositionFromString('top left', 100, 100, 200, 200);
    expect(position1.style.top).toEqual(0);
    expect(position1.style.left).toEqual(0);
    expect(position1.style.bottom).toEqual('auto');
    expect(position1.style.right).toEqual('auto');

    const position2 = getPositionFromString('bottom right', 100, 100, 200, 200);
    expect(position2.style.top).toEqual('auto');
    expect(position2.style.left).toEqual('auto');
    expect(position2.style.bottom).toEqual(0);
    expect(position2.style.right).toEqual(0);
});
