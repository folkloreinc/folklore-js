const webpack = require('webpack');
const path = require('path');
const isFunction = require('lodash/isFunction');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const getLocalIdent = require('./lib/getLocalIdent');
const config = require('./config').webpack;

const contextPath = path.join(process.env.PWD, '<%= srcPath %>');
const outputPath = path.join(process.env.PWD, '<%= tmpPath %>');
const publicPath = '<%= publicPath %>';

module.exports = (env) => {
    const getConfigValue = val => (isFunction(val) ? val(env) : val);
    const CSS_FILENAME = getConfigValue(config.cssFilename);
    const CSS_NAME = getConfigValue(config.cssLocalIdent);
    const IMAGE_FILENAME = getConfigValue(config.imageFilename);
    const FONT_FILENAME = getConfigValue(config.fontFilename);
    const IMAGE_PUBLIC_PATH = getConfigValue(config.imagePublicPath);
    const FONT_PUBLIC_PATH = getConfigValue(config.fontPublicPath);

    const extractPlugin = new ExtractTextPlugin({
        filename: CSS_FILENAME,
        allChunks: true,
        disable: env === 'dev',
    });

    const cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: true,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                config: {
                    path: path.join(__dirname, './postcss.config.js'),
                    ctx: {
                        env,
                    },
                },
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                includePaths: [
                    path.join(process.env.PWD, './node_modules'),
                ],
            },
        },
    ];

    const cssLocalLoaders = [].concat(cssLoaders);
    cssLocalLoaders[0] = {
        loader: 'css-loader',
        options: {
            modules: true,
            sourceMap: true,
            importLoaders: 1,
            localIdentName: CSS_NAME,
            getLocalIdent: (context, localIdentName, localName) => (
                getLocalIdent(localIdentName, localName, context.resourcePath)
            ),
        },
    };

    return {

        context: contextPath,

        <%- entriesFormatted !== null ? entriesFormatted : '' %>

        output: {
            path: outputPath,
            filename: '[name].js',
            chunkFilename: '[name].js',
            jsonpFunction: 'flklrJsonp',
            publicPath,
        },

        plugins: [
            <% if (typeof entries.vendor !== 'undefined') { %>new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity,
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['main'],
            }),<% } %>
            extractPlugin,
        ],

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    include: contextPath,
                    options: {
                        forceEnv: env,
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                    include: contextPath,
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                    include: contextPath,
                },
                {
                    test: /\.svg$/,
                    include: contextPath,
                    exclude: [
                        /\/img\//
                    ],
                    use: [
                        `babel-loader?forceEnv=${env}&cacheDirectory`,
                        'svg-react-loader',
                    ],
                },

                {
                    test: /\.global\.s[ac]ss$/,
                    include: contextPath,
                    use: env === 'dev' ? ['style-loader?convertToAbsoluteUrls'].concat(cssLoaders) : extractPlugin.extract({
                        fallback: 'style-loader',
                        use: cssLoaders,
                    }),
                },

                {
                    test: /\.s[ac]ss$/,
                    include: contextPath,
                    exclude: /.global\.s[ac]ss$/,
                    use: env === 'dev' ? ['style-loader?convertToAbsoluteUrls'].concat(cssLocalLoaders) : extractPlugin.extract({
                        fallback: 'style-loader',
                        use: cssLocalLoaders,
                    }),
                },

                {
                    test: /\.(png|gif|jpg|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader',
                    include: contextPath,
                    exclude: /fonts\//,
                    options: {
                        limit: 1000,
                        name: IMAGE_FILENAME,
                        publicPath: IMAGE_PUBLIC_PATH,
                    },
                },

                {
                    test: /fonts\/(.*?)\.(ttf|eot|woff|woff2|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader',
                    include: contextPath,
                    options: {
                        limit: 1000,
                        name: FONT_FILENAME,
                        publicPath: FONT_PUBLIC_PATH,
                    },
                },
            ],
        },

        resolve: {
            extensions: ['.js', '.jsx', '.es6'],
            modules: [
                path.join(process.env.PWD, './node_modules'),
            ],
        },

        stats: {
            colors: true,
            modules: true,
            reasons: true,
            modulesSort: 'size',
            children: true,
            chunks: true,
            chunkModules: true,
            chunkOrigins: true,
            chunksSort: 'size',
        },

        performance: {
            maxAssetSize: 100000,
            maxEntrypointSize: 300000,
        },

        cache: true,
        watch: false,
    };
};
