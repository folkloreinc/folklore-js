import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import path from 'path';

const packageJson = fs.readJSONSync(path.join(process.cwd(), 'package.json'));
const { type } = packageJson;

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
    input: fs.existsSync(path.join(process.cwd(), 'src/index.ts'))
        ? 'src/index.ts'
        : 'src/index.js',
    output: [
        type !== 'module' ? {
            file: 'dist/index.cjs.js',
            format: 'cjs',
        } : null,
        {
            file: 'dist/index.js',
        },
    ].filter(it => it !== null),
    plugins,
};
