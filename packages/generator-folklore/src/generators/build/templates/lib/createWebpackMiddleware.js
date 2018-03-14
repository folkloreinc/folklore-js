/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const stripAnsi = require('strip-ansi');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = (webpackConfig, opts, browserSync) => {
    const options = {
        hotReload: false,
        ...opts,
    };
    const bundler = webpack(webpackConfig);

    bundler.plugin('done', (stats) => {
        if (stats.hasErrors() || stats.hasWarnings()) {
            return browserSync.sockets.emit('fullscreen:message', {
                title: 'Webpack Error:',
                body: stripAnsi(stats.toString()),
                timeout: 100000,
            });
        }
        return !options.hotReload ? browserSync.reload() : null;
    });

    const middlewareOptions = {
        publicPath: webpackConfig.output.publicPath,
        ...options,
    };

    const middlewares = [
        webpackDevMiddleware(bundler, middlewareOptions),
    ];

    if (options.hotReload) {
        middlewares.push(webpackHotMiddleware(bundler));
    }

    return middlewares;
};
