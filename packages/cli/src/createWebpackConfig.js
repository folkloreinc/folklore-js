import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { isString, isArray } from 'lodash';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
import { DefinePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { merge } from 'webpack-merge';

import getAbsolutePath from './getAbsolutePath';
import getAppEnv from './getAppEnv';
import imageminPresets from './imageminPresets';

export default (entry, opts = {}) => {
    const {
        srcPath = 'src',
        publicPath = '/',
        outputPath = 'dist',
        jsOutputPath = 'static/js',
        jsOutputFilename = '[name].[contenthash:8].js',
        jsChunkOutputFilename = '[name].[contenthash:8].chunk.js',
        cssOutputPath = 'static/css',
        cssOutputFilename = '[name].[contenthash:8].css',
        cssChunkOutputFilename = '[name].[contenthash:8].chunk.css',
        assetOutputPath = 'static/media',
        assetOutputFilename = '[name].[hash][ext]',
        manifestRemoveKeyHash = /([a-f0-9]{16,32}\.)/gi,
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
        babelRc = false,
        babelConfigFile = null,
        withoutFormatjs = false,
        defineEnv: extraDefineEnv = null,
        disableImageOptimization = false,
        imageOptimization = 'lossless',
        imageDataUrlMaxSize = 5000,
        babelPresetEnvUseBuiltins = 'entry',
        postcssConfigFile = null,
    } = opts;

    const isProduction = process.env.NODE_ENV === 'production';
    const isTesting = process.env.NODE_ENV === 'test';
    const isDevelopment = process.env.NODE_ENV === 'development';

    const absSrcPath = getAbsolutePath(srcPath);
    const absOutputPath = getAbsolutePath(outputPath);
    const absHtmlPath = getAbsolutePath(htmlPath);
    const absPostcssConfigFile = isString(postcssConfigFile)
        ? getAbsolutePath(postcssConfigFile)
        : postcssConfigFile;

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
                    postcssOptions:
                        absPostcssConfigFile !== null
                            ? {
                                  config: absPostcssConfigFile,
                              }
                            : {
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
        const newItems = loadExtend(items) || null;
        return !isArray(newItems) && newItems !== null ? [newItems] : newItems;
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
                ? path.join(jsOutputPath, jsOutputFilename)
                : path.join(jsOutputPath, 'bundle.js'),
            chunkFilename: isProduction
                ? path.join(jsOutputPath, jsChunkOutputFilename)
                : path.join(jsOutputPath, '[name].chunk.js'),
            assetModuleFilename: path.join(assetOutputPath, assetOutputFilename),
            publicPath,
            pathinfo: isDevelopment || isTesting,
            devtoolModuleFilenameTemplate: isProduction
                ? (info) => path.relative(absSrcPath, info.absoluteResourcePath).replace(/\\/g, '/')
                : (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
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
                '.cjs',
            ],

            fallback: {
                fs: false,
                tls: false,
                net: false,
                zlib: false,
                http: false,
                https: false,
                stream: false,
                crypto: false,
                path: false,
                os: false,
            },

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
                    test: /\.m?js$/,
                    resolve: {
                        fullySpecified: false,
                    },
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
                                            plugins: [
                                                {
                                                    name: 'preset-default',
                                                    params: {
                                                        overrides: {
                                                            // disable plugins
                                                            removeViewBox: false,
                                                        },
                                                    },
                                                },
                                            ],
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
                                            useBuiltIns: babelPresetEnvUseBuiltins,
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
                                    !withoutFormatjs && [
                                        require.resolve('babel-plugin-formatjs'),
                                        {
                                            idInterpolationPattern: formatjsIdInterpolationPattern,
                                            removeDefaultMessage: isProduction,
                                            ast: isProduction,
                                        },
                                    ],
                                ].filter(Boolean),
                                babelrc: babelRc,
                                cacheDirectory: true,
                                cacheCompression: false,
                                compact: isProduction,
                                ...(babelConfigFile !== null
                                    ? {
                                          configFile: babelConfigFile,
                                      }
                                    : {}),
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
                    templateParameters: {
                        process: {
                            env: process.env,
                        },
                        ...(htmlTemplateParameters || {}),
                    },
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
                    filename: path.join(cssOutputPath, cssOutputFilename),
                    chunkFilename: path.join(cssOutputPath, cssChunkOutputFilename),
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
                removeKeyHash: manifestRemoveKeyHash,
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
