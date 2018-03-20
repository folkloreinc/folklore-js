import React from 'react';
import classNames from 'classnames';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import KeepValue from './KeepValue';

export default (name, module, opts) => {
    const options = {
        ...opts,
    };
    return (
        storiesOf(name, module)
            .addDecorator((story, context) => withInfo()(story)(context))
            .addDecorator(story => (
                <div className="container" style={{ marginTop: 10 }}>
                    { story() }
                </div>
            ))
    );
};
