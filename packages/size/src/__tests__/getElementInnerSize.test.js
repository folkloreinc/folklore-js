import { getElementInnerSize } from '../getElementInnerSize';

test('padding with direction', () => {
    const div = document.createElement('div');
    div.style.display = 'block';
    div.style.overflow = 'hidden';
    div.style.paddingLeft = '20px';
    div.style.paddingTop = '20px';
    const size = getElementInnerSize(div);
    expect(size.height).toEqual(-20);
    expect(size.width).toEqual(-20);
});

test('padding without direction', () => {
    const div = document.createElement('div');
    div.style.display = 'block';
    div.style.overflow = 'hidden';
    div.style.padding = '20px 0';
    const size1 = getElementInnerSize(div);
    expect(size1.height).toEqual(-40);
    expect(size1.width).toEqual(0);

    div.style.padding = '20px 10px 10px 20px';
    const size2 = getElementInnerSize(div);
    expect(size2.height).toEqual(-30);
    expect(size2.width).toEqual(-30);
});

test('border without direction', () => {
    const div = document.createElement('div');
    div.style.display = 'block';
    div.style.overflow = 'hidden';
    div.style.border = 'solid 2px #000';
    const size1 = getElementInnerSize(div);
    expect(size1.height).toEqual(-4);
    expect(size1.width).toEqual(-4);
});

test('border with direction', () => {
    const div = document.createElement('div');
    div.style.display = 'block';
    div.style.overflow = 'hidden';
    div.style.borderTop = 'solid 2px #000';
    div.style.borderLeft = 'solid 4px #000';
    const size1 = getElementInnerSize(div);
    expect(size1.height).toEqual(-2);
    expect(size1.width).toEqual(-4);
});
