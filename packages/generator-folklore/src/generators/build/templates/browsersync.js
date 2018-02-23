/* eslint-disable import/no-extraneous-dependencies */
const BrowserSync = require('browser-sync');
const get = require('lodash/get');
const merge = require('lodash/merge');
/* eslint-enable import/no-extraneous-dependencies */
const createProxyMiddleware = require('./lib/createProxyMiddleware');
const createWebpackMiddleware = require('./lib/createWebpackMiddleware');
const config = require('./config');
const createWebpackConfig = require('./webpack.config');

/**
 * BrowserSync
 */
const browserSync = BrowserSync.create();
const browserSyncOptions = merge({

}, config.browsersync || {});

/**
 * Webpack middleware
 */
const webpackMiddlewareConfig = config.webpackMiddleware || {};
const webpackMiddleware = createWebpackMiddleware(
    createWebpackConfig('dev'),
    webpackMiddlewareConfig,
    browserSync,
);
browserSyncOptions.middleware.push(webpackMiddleware);

/**
 * Proxy
 */
if (browserSyncOptions.proxy) {
    const { proxy } = browserSyncOptions;
    browserSyncOptions.proxy = null;
    browserSyncOptions.open = 'external';
    delete browserSyncOptions.proxy;
    const proxyMiddleware = createProxyMiddleware(proxy, {
        staticDirs: get(browserSyncOptions, 'server.baseDir', []),
    });
    browserSyncOptions.middleware.push(proxyMiddleware);
}

/**
 * Start webpack
 */
browserSync.init(browserSyncOptions);
