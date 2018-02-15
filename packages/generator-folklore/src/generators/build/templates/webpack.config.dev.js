/* eslint-disable import/no-extraneous-dependencies */
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');<%
if (options['webpack-html']) { %>
const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %>
const webpackConfig = require('./webpack.config.base');<%
if (devContext !== null) { %>
const path = require('path');<% } %>
/* eslint-enable import/no-extraneous-dependencies */
<% if (devContext !== null) { %>
const contextPath = path.join(process.env.PWD, '<%= devContext %>');<% } %>

module.exports = env => (
    webpackMerge.strategy({
        entry: 'replace',
    })(webpackConfig(env), {
<% if (devContext !== null) { %>        context: contextPath,
        <% } %>
        <%- devEntriesFormatted !== null ? devEntriesFormatted : '' %>

        devtool: 'source-map',

        plugins: [
            <% if (options['hot-reload']) { %>new webpack.HotModuleReplacementPlugin(),<% } %>
            new webpack.NamedModulesPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                },
                __DEV__: JSON.stringify(true),
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
        ],

    })
);
