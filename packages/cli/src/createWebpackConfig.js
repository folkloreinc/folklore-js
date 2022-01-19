import path from 'path';
import { isString, isObject } from 'lodash';
import { merge } from 'webpack-merge';
import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import getAppEnv from './getAppEnv';
import imageminPresets from './imageminPresets';
import getAbsolutePath from './getAbsolutePath';

export default (entry, opts = {}) => {
    const {
        srcPath = 'src',
        publicPath = '/',
        outputPath = 'dist',
        jsOutputPath = 'static/js',
        cssOutputPath = 'static/css',
        assetOutputPath = 'static/media',
        htmlOutputPath = 'index.html',
        htmlPath = null,
        htmlTemplateParameters: htmlTemplateParametersPath = undefined,
        mergeConfig = null,
        disableSourceMap = false,
        analyzer = false,
        formatjsIdInterpolationPattern = '[sha512:contenthash:base64:6]',
        loaders = null,
        plugins = null,
        profile = false,
        defineEnv: extraDefineEnv = null,
        disableImageOptimization = false,
        imageOptimization = 'lossless',
        imageDataUrlMaxSize = 5000,
    } = opts;

    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';

    const absSrcPath = getAbsolutePath(srcPath);
    const absOutputPath = getAbsolutePath(outputPath);
    const absHtmlPath = getAbsolutePath(htmlPath);

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
                loader: require.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
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
                        root: absSrcPath,
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

    const loadExtend = (extend) => (isString(extend) ? require(getAbsolutePath(extend)) : extend);

    const loadExtendItems = (items) => {
        const newItems = loadExtend(items);
        return isObject(newItems) ? [newItems] : newItems;
    };

    const extraLoaders = loadExtendItems(loaders);
    const extraPlugins = loadExtendItems(plugins);
    const htmlTemplateParameters = loadExtend(htmlTemplateParametersPath);

    const defineEnv = getAppEnv({
        extra: extraDefineEnv,
    });

    const baseConfig = {
        target: 'browserslist',

        mode: isProduction ? 'production' : 'development',

        bail: isProduction,

        // eslint-disable-next-line no-nested-ternary
        devtool: !disableSourceMap
            ? isProduction
                ? 'source-map'
                : 'cheap-module-source-map'
            : false,

        ignoreWarnings: [/Failed to parse source map/],

        entry,

        output: {
            path: absOutputPath,
            filename: isProduction
                ? path.join(jsOutputPath, '[name].[contenthash:8].js')
                : path.join(jsOutputPath, 'bundle.js'),
            chunkFilename: isProduction
                ? path.join(jsOutputPath, '[name].[contenthash:8].chunk.js')
                : path.join(jsOutputPath, '[name].chunk.js'),
            assetModuleFilename: path.join(assetOutputPath, '[name].[hash][ext]'),
            publicPath,
            pathinfo: isDevelopment,
            devtoolModuleFilenameTemplate: isProduction
                ? (info) => path.relative(absSrcPath, info.absoluteResourcePath).replace(/\\/g, '/')
                : isDevelopment &&
                  ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
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

            alias: {
                ...(profile
                    ? {
                          'react-dom$': 'react-dom/profiling',
                          'scheduler/tracing': 'scheduler/tracing-profiling',
                      }
                    : null),
            },
        },

        module: {
            strictExportPresence: true,
            rules: [
                !disableSourceMap && {
                    enforce: 'pre',
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                    loader: require.resolve('source-map-loader'),
                },
                {
                    oneOf: [
                        ...(extraLoaders || []),
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageDataUrlMaxSize,
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
                            test: /\.(js|mjs|cjs|jsx|ts|tsx)$/,
                            include: absSrcPath,
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
                            exclude: [
                                /^$/,
                                /\.(js|mjs|cjs|jsx|ts|tsx)$/,
                                /\.html$/,
                                /\.html\.ejs$/,
                                /\.json$/,
                            ],
                            type: 'asset/resource',
                        },
                    ],
                },
            ].filter(Boolean),
        },

        plugins: [
            new DefinePlugin({
                'process.env': Object.keys(defineEnv).reduce(
                    (map, key) => ({
                        ...map,
                        [key]: JSON.stringify(defineEnv[key]),
                    }),
                    {},
                ),
            }),

            absHtmlPath !== null &&
                new HtmlWebpackPlugin({
                    template: absHtmlPath,
                    templateParameters: htmlTemplateParameters || {},
                    filename: htmlOutputPath,
                    inject: true,
                    minify: isProduction
                        ? {
                              removeComments: true,
                              collapseWhitespace: true,
                              removeRedundantAttributes: true,
                              useShortDoctype: true,
                              removeEmptyAttributes: true,
                              removeStyleLinkTypeAttributes: true,
                              keepClosingSlash: true,
                              minifyJS: true,
                              minifyCSS: true,
                              minifyURLs: true,
                          }
                        : false,
                }),

            isProduction &&
                new MiniCssExtractPlugin({
                    filename: path.join(cssOutputPath, '[name].[contenthash:8].css'),
                    chunkFilename: path.join(cssOutputPath, '[name].[contenthash:8].chunk.css'),
                }),

            !disableImageOptimization &&
                isProduction &&
                new ImageMinimizerPlugin(
                    {
                        lossless: {
                            minimizerOptions: {
                                ...imageminPresets.losslessWebpack,
                            },
                        },
                        lossy: {
                            minify: ImageMinimizerPlugin.squooshMinify,
                        },
                    }[imageOptimization],
                ),

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

            ...(extraPlugins || []),
        ].filter(Boolean),
    };

    // Merge config
    if (mergeConfig !== null) {
        const configToMerge = isString(mergeConfig)
            ? require(getAbsolutePath(mergeConfig))
            : mergeConfig;
        return merge(baseConfig, configToMerge);
    }
    return baseConfig;
};
