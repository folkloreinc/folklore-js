import baseConfig, { plugins } from '../../rollup.config';

export default [
    {
        input: 'src/cli.js',
        output: {
            file: 'dist/cli.js',
            format: 'cjs',
            banner: '#!/usr/bin/env node',
        },
        plugins,
    },
    baseConfig,
];
