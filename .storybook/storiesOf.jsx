import React from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';

export default (name, module, opts) => {
    return (
        storiesOf(name, module)
            .addDecorator(withInfo)
    );
};
