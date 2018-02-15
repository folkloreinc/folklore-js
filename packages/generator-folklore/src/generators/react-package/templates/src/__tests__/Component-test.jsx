import React from 'react';
import renderer from 'react-test-renderer';
import Component from '../Component';

test('Component render a <div />', () => {
    const component = renderer.create(
        <Component />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
