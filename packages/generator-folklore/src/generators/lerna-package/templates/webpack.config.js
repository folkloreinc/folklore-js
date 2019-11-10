/* eslint-disable import/no-extraneous-dependencies */
const webpackMerge = require('webpack-merge');
const webpackConfig = require('../../build/webpack.config.prod');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = env => (
    webpackMerge(webpackConfig(env), {
        entry: {
            '<%= entryName %>': './index',
        },
        output: {
            library: '<%= libraryName %>',
        },
    })
);
