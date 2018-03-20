/* eslint-disable import/no-extraneous-dependencies */
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');<%
if (options['webpack-html']) { %>
const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %>
const webpackConfig = require('./webpack.config.base');
/* eslint-enable import/no-extraneous-dependencies */

const outputPath = path.join(process.env.PWD, '<%= destPath %>');

module.exports = env => (
    webpackMerge(webpackConfig(env), {
        <%- distEntriesFormatted !== null ? distEntriesFormatted : '' %>

        output: {
            path: outputPath,
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
                __DEV__: JSON.stringify(false),
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: {
                    beautify: false,
                    mangle: {
                        keep_fnames: true,
                    },
                    compress: {
                        warnings: false,
                    },
                    comments: false,
                },
            }),<% if (options['webpack-html']) { %>
            /**
             * Dynamically generate index.html page
             */
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'index.html.ejs',
                env: 'dev',
                inject: false,
            }),<% } %>
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                exclude: [/vendor\//],
            }),
        ],<% if(options.lerna) { %>

        externals: [
            nodeExternals({
                whitelist: [/lodash/],
                modulesDir: path.join(__dirname, '../node_modules'),
            }),
        ],<% } %>

    })
);
