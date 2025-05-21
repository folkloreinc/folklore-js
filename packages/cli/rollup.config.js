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
            inlineDynamicImports: true
        },
        plugins: [
            // resolve({
            //     // exportConditions: ['node'],
            //     // modulesOnly: true,
            //     resolveOnly: (path) => {
            //         console.log(path);
            //         if (path === 'fsevents' || path === 'esrecurse') {
            //             return false;
            //         }
            //         return true;
            //     },
            //     preferBuiltins: true,
            // }),
            resolve({
                // exportConditions: ['node'],
                // modulesOnly: true,
                resolveOnly: [
                    /@formatjs/,
                    // /@vue/,
                    // /vue/,
                    // /compiler/
                ],
            }),
            ...plugins,
        ],
    },
    baseConfig,
];
