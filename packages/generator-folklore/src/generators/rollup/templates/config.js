import path from 'path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export const plugins = [
    json(),
    resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        jail: path.join(process.cwd(), 'src'),
        preferBuiltins: true,
    }),
    commonjs(),
    babel({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
        exclude: 'node_modules/**',
        rootMode: 'upward',
        babelHelpers: 'runtime',
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        __buildDate__: () => JSON.stringify(new Date()),
        __buildVersion: 15,
    }),
];

export default [
    {
        input: 'src/index.js',
        output: {
            file: 'index.js',
            format: 'cjs',
        },
        plugins,
    },
    // {
    //     input: 'src/cli.js',
    //     output: {
    //         file: 'cli.js',
    //         format: 'cjs',
    //         banner: '#!/usr/bin/env node',
    //     },
    //     plugins,
    // },
];
