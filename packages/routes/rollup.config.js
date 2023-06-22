import { plugins } from '../../rollup.config';

export default [
    {
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
    },
    {
        input: 'src/wouter.js',
        output: [
            {
                file: 'dist/wouter.cjs.js',
                format: 'cjs',
            },
            {
                file: 'dist/wouter.es.js',
            },
        ],
        plugins,
    }
];
