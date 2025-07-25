const path = require('path');
const lernaJSON = require('./lerna.json');

module.exports = (api) => {
    api.cache(true);
    return {
        babelrcRoots: [
            '.',
            ...lernaJSON.packages.map((packagePath) => path.join('./', packagePath)),
        ],
        presets: [
            [
                require.resolve('@babel/preset-env'),
                process.env.NODE_ENV === 'test'
                    ? { targets: { node: 'current' } }
                    : {
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
            [require.resolve('@babel/preset-typescript'), {}],
        ],

        plugins: [[require.resolve('@babel/plugin-transform-runtime'), {}]],
    };
};
