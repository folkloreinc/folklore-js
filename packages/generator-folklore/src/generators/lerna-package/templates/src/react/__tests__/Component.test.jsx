import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Component from '../Component';

test('match snapshot', () => {
    const component = renderer.create((
        <Component />
    ));
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
