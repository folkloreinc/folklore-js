import formatjs from 'eslint-plugin-formatjs';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintReact from '@eslint-react/eslint-plugin';

export default tseslint.config(
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    },
    {
        ignores: ['**/*.config.js'],
    },
    {
        settings: {
            react: {
                defaultVersion: '19',
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
    eslintPluginPrettierRecommended,
    {
        rules: {
            'formatjs/no-literal-string-in-jsx': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
);
