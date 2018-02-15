import { configure } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies

const req = require.context('../src', true, /__stories__/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
