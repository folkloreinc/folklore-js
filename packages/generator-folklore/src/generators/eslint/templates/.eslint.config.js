const reactPlugin = require('eslint-plugin-react');
const formatjs = require('eslint-plugin-formatjs');
const globals = require('globals');
const babelParser = require('@babel/eslint-parser');
const importPlugin = require('eslint-plugin-import');
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintReact = require('@eslint-react/eslint-plugin');

module.exports = tseslint.config(
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    },
    {
        ignores: ['**/*.config.js'],
    },
    {
        settings: {
            react: {
                defaultVersion: '18',
            },
        },
        languageOptions: {
            globals: {
                ...Object.keys(globals.browser).reduce(
                    (map, key) => ({
                        ...map,
                        [key.trim()]: globals.browser[key],
                    }),
                    {},
                ),
            },
        },
    },
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                ecmaVersion: 'latest',
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-react', '@babel/preset-typescript'],
                },
            },
        },
    },
    js.configs.recommended,
    tseslint.configs.recommended,
    eslintReact.configs['recommended-typescript'],
    importPlugin.flatConfigs.typescript,
    importPlugin.flatConfigs.recommended,
    formatjs.configs.recommended,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    eslintPluginPrettierRecommended,
    {
        rules: {
            'formatjs/no-literal-string-in-jsx': 'off',
        },
    },
);
