/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackConfig = require('../../build/webpack.config.dist');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = () => webpackMerge(webpackConfig, {
    entry: {
        pan: [
            path.join(__dirname, '../../build/polyfills'),
            path.join(__dirname, './src/index'),
        ],
    },
    output: {
        library: 'Size',
    },
});
