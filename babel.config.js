const path = require('path');
const lernaJSON = require('./lerna.json');

module.exports = {
    babelrcRoots: ['.', ...lernaJSON.packages.map((packagePath) => path.join('./', packagePath))],
    presets: [
        [
            require.resolve('@babel/preset-env'),
            {
                targets: 'defaults',
                modules: false,
                useBuiltIns: false,
            },
        ],
        [
            require.resolve('@babel/preset-react'),
            {
                runtime: 'automatic',
                throwIfNamespace: false,
            },
        ],
    ],

    plugins: [[require.resolve('@babel/plugin-transform-runtime'), {}]],
};
