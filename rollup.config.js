import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';

export const plugins = [
    json(),
    resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx'],
        jail: path.join(process.cwd(), 'src'),
        preferBuiltins: true,
    }),
    commonjs(),
    babel({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.ts', '.tsx'],
        exclude: 'node_modules/**',
        rootMode: 'upward',
        babelHelpers: 'runtime',
    }),
];

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/es.js',
        },
    ],
    plugins,
};
