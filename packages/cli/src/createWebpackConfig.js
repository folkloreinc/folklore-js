import path from 'path';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export default (entry, opts = {}) => {
    const {
        srcPath = 'src',
        publicPath = '/',
        outputPath = 'dist',
        jsOutputPath = 'static/js',
        cssOutputPath = 'static/css',
        assetOutputPath = 'static/media',
        disableSourceMap = false,
        analyzer = false,
        formatjsIdInterpolationPattern = '[sha512:contenthash:base64:6]',
        loaders = null,
    } = opts;

    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';

    const getStyleLoaders = (cssOptions, preProcessor) => {
        const styleLoaders = [
            isProduction
                ? {
                      loader: MiniCssExtractPlugin.loader,
                  }
                : require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: cssOptions,
            },
            {
                // Options for PostCSS as we reference these options twice
                // Adds vendor prefixing based on your specified browser support in
                // package.json
                loader: require.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebook/create-react-app/issues/2677
                        ident: 'postcss',
                        plugins: [
                            'postcss-flexbugs-fixes',
                            [
                                'postcss-preset-env',
                                {
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                },
                            ],
                            // Adds PostCSS Normalize as the reset css with default options,
                            // so that it honors browserslist config in package.json
                            // which in turn let's users customize the target behavior as per their needs.
                            'postcss-normalize',
                        ],
                    },
                    sourceMap: !disableSourceMap,
                },
            },
        ].filter(Boolean);
        if (preProcessor) {
            styleLoaders.push(
                {
                    loader: require.resolve('resolve-url-loader'),
                    options: {
                        sourceMap: !disableSourceMap,
                        root: path.isAbsolute(srcPath)
                            ? srcPath
                            : path.join(process.cwd(), srcPath),
                    },
                },
                {
                    loader: require.resolve(preProcessor),
                    options: {
                        sourceMap: !disableSourceMap,
                    },
                },
            );
        }
        return styleLoaders;
    };

    let extraLoaders = null;
    if (isArray(loaders)) {
        extraLoaders = loaders;
    } else if (isString(loaders)) {
        const newLoaders = require(path.isAbsolute(loaders)
            ? loaders
            : path.join(process.cwd(), loaders));
        extraLoaders = isArray(newLoaders) ? newLoaders : [newLoaders];
    } else if (isObject(loaders)) {
        extraLoaders = [loaders];
    }

    return {
        target: 'browserslist',

        mode: isProduction ? 'production' : 'development',

        bail: isProduction,

        // eslint-disable-next-line no-nested-ternary
        devtool: !disableSourceMap
            ? isProduction
                ? 'source-map'
                : 'cheap-module-source-map'
            : false,

        entry,

        output: {
            path: path.isAbsolute(outputPath)
                ? outputPath
                : path.resolve(process.cwd(), outputPath),
            filename: isProduction
                ? path.join(jsOutputPath, '[name].[contenthash:8].js')
                : path.join(jsOutputPath, 'bundle.js'),
            chunkFilename: isProduction
                ? path.join(jsOutputPath, '[name].[contenthash:8].chunk.js')
                : path.join(jsOutputPath, '[name].chunk.js'),
            assetModuleFilename: path.join(assetOutputPath, '[name].[hash][ext]'),
            publicPath,
        },

        optimization: {
            moduleIds: 'deterministic',
            runtimeChunk: isProduction,
            splitChunks: {
                chunks: isProduction ? 'all' : 'async',
            },
        },

        resolve: {
            extensions: [
                '.web.mjs',
                '.mjs',
                '.web.js',
                '.js',
                '.web.ts',
                '.ts',
                '.web.tsx',
                '.tsx',
                '.json',
                '.web.jsx',
                '.jsx',
            ],
        },

        module: {
            strictExportPresence: true,
            rules: [
                {
                    oneOf: [
                        ...(extraLoaders || []),
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: 10000,
                                },
                            },
                        },

                        {
                            test: /\.svg$/,
                            use: [
                                {
                                    loader: require.resolve('@svgr/webpack'),
                                    options: {
                                        prettier: false,
                                        // svgo: false,
                                        svgoConfig: {
                                            plugins: [{ removeViewBox: false }],
                                        },
                                        titleProp: true,
                                        ref: true,
                                    },
                                },
                                {
                                    loader: require.resolve('file-loader'),
                                    options: {
                                        name: 'static/media/[name].[hash].[ext]',
                                    },
                                },
                            ],
                            issuer: {
                                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
                            },
                        },

                        // Process application JS with Babel.
                        // The preset includes JSX, Flow, TypeScript, and some ESnext features.
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: path.isAbsolute(srcPath)
                                ? srcPath
                                : path.join(process.cwd(), srcPath),
                            loader: require.resolve('babel-loader'),
                            options: {
                                presets: [
                                    [
                                        require.resolve('@babel/preset-env'),
                                        {
                                            modules: false,
                                            useBuiltIns: 'entry',
                                            corejs: 3,
                                        },
                                    ],
                                    [
                                        require.resolve('@babel/preset-react'),
                                        {
                                            runtime: 'automatic',
                                            throwIfNamespace: false,
                                        },
                                    ],
                                ],
                                plugins: [
                                    isDevelopment && require.resolve('react-refresh/babel'),
                                    [
                                        require.resolve('babel-plugin-formatjs'),
                                        {
                                            idInterpolationPattern: formatjsIdInterpolationPattern,
                                            removeDefaultMessage: isProduction,
                                            ast: isProduction,
                                        },
                                    ],
                                ].filter(Boolean),
                                cacheDirectory: true,
                                cacheCompression: false,
                                compact: isProduction,
                            },
                        },

                        // "postcss" loader applies autoprefixer to our CSS.
                        // "css" loader resolves paths in CSS and adds assets as dependencies.
                        // "style" loader turns CSS into JS modules that inject <style> tags.
                        // In production, we use MiniCSSExtractPlugin to extract that CSS
                        // to a file, but in development "style" loader enables hot editing
                        // of CSS.
                        // By default we support CSS Modules with the extension .module.css
                        {
                            test: /\.css$/,
                            exclude: /\.module\.css$/,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap: !disableSourceMap,
                                modules: {
                                    mode: 'icss',
                                },
                            }),
                            // Don't consider CSS imports dead code even if the
                            // containing package claims to have no side effects.
                            // Remove this when webpack adds a warning or an error for this.
                            // See https://github.com/webpack/webpack/issues/6571
                            sideEffects: true,
                        },
                        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
                        // using the extension .module.css
                        {
                            test: /\.module\.css$/,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap: !disableSourceMap,
                                modules: {
                                    mode: 'local',
                                    getLocalIdent: getCSSModuleLocalIdent,
                                },
                            }),
                        },
                        // Opt-in support for SASS (using .scss or .sass extensions).
                        // By default we support SASS Modules with the
                        // extensions .module.scss or .module.sass
                        {
                            test: /\.scss$/,
                            exclude: /\.module\.scss$/,
                            use: getStyleLoaders(
                                {
                                    importLoaders: 3,
                                    sourceMap: !disableSourceMap,
                                    modules: {
                                        mode: 'icss',
                                    },
                                },
                                'sass-loader',
                            ),
                            // Don't consider CSS imports dead code even if the
                            // containing package claims to have no side effects.
                            // Remove this when webpack adds a warning or an error for this.
                            // See https://github.com/webpack/webpack/issues/6571
                            sideEffects: true,
                        },
                        // Adds support for CSS Modules, but using SASS
                        // using the extension .module.scss or .module.sass
                        {
                            test: /\.module\.scss$/,
                            use: getStyleLoaders(
                                {
                                    importLoaders: 3,
                                    sourceMap: !disableSourceMap,
                                    modules: {
                                        mode: 'local',
                                        getLocalIdent: getCSSModuleLocalIdent,
                                    },
                                },
                                'sass-loader',
                            ),
                        },
                        {
                            // Exclude `js` files to keep "css" loader working as it injects
                            // its runtime that would otherwise be processed through "file" loader.
                            // Also exclude `html` and `json` extensions so they get processed
                            // by webpacks internal loaders.
                            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            type: 'asset/resource',
                        },
                    ],
                },
            ],
        },

        plugins: [
            isProduction &&
                new MiniCssExtractPlugin({
                    filename: path.join(cssOutputPath, '[name].[contenthash:8].css'),
                    chunkFilename: path.join(cssOutputPath, '[name].[contenthash:8].chunk.css'),
                }),

            new WebpackManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath,
                generate: (seed, files, entrypoints) => {
                    const manifestFiles = files.reduce(
                        (manifest, file) => ({
                            ...manifest,
                            [file.name]: file.path,
                        }),
                        seed,
                    );
                    const entrypointFiles = entrypoints.main.filter(
                        (fileName) => !fileName.endsWith('.map'),
                    );

                    return {
                        files: manifestFiles,
                        entrypoints: entrypointFiles,
                    };
                },
            }),

            isDevelopment && new ReactRefreshWebpackPlugin(),

            analyzer && new BundleAnalyzerPlugin(),
        ].filter(Boolean),
    };
};
