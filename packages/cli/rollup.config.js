import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import baseConfig, { plugins } from '../../rollup.config';

export default [
    {
        input: 'src/cli.js',
        output: {
            file: 'dist/cli.js',
            format: 'cjs',
            banner: '#!/usr/bin/env node',
            // inlineDynamicImports: true
        },
        plugins: [
            // resolve({
            //     // exportConditions: ['node'],
            //     // modulesOnly: true,
            //     resolveOnly: [
            //         'chalk',
            //         '@formatjs/cli-lib'
            //     ],
            // }),
            ...plugins,
        ],
    },
    baseConfig,
];
