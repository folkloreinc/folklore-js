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

        plugins: [
            [require.resolve('@babel/plugin-transform-runtime'), {}],
            [
                require.resolve('babel-plugin-react-compiler'),
                {
                    compilationMode: 'annotation',
                    logger: {
                        logEvent(filename, event) {
                            if (event.kind === 'CompileError') {
                                console.error(`\nCompilation failed: ${filename}`);
                                console.error(`Reason: ${event.detail.reason}`);

                                if (event.detail.description) {
                                    console.error(`Details: ${event.detail.description}`);
                                }

                                if (event.detail.loc) {
                                    const { line, column } = event.detail.loc.start;
                                    console.error(`Location: Line ${line}, Column ${column}`);
                                }

                                if (event.detail.suggestions) {
                                    console.error('Suggestions:', event.detail.suggestions);
                                }
                            }
                        },
                    },
                },
            ],
        ],
    };
};
