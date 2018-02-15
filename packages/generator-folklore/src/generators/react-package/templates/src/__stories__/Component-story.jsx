import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Component from '../Component';

storiesOf('Component', module)
    .add('simple', () => (
        <Component />
    ));
