import React from 'react';
import { action } from '@storybook/addon-actions';// eslint-disable-line import/no-extraneous-dependencies

import storiesOf from '../../../../.storybook/storiesOf';
import Component from '../Component';

storiesOf('Component', module)
    .add('simple', () => (
        <div>
            <Component

            />
        </div>
    ));
