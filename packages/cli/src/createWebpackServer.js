import { isString } from 'lodash';
import url from 'url';
import WebpackDevServer from 'webpack-dev-server';

import createWebpackCompiler from './createWebpackCompiler';
import getAbsolutePath from './getAbsolutePath';

const createWebpackServer = (config, opts = {}) => {
    const compiler = createWebpackCompiler(config);
    const {
        proxy = undefined,
        host = null,
        open = true,
        indexPath = '/index.html',
        setupMiddlewares = null,
        ...otherOpts
    } = opts;
    const {
        historyApiFallback = typeof proxy === 'undefined'
            ? {
                  index: indexPath,
              }
            : undefined,
    } = opts;
    const finalSetupMiddlewares = isString(setupMiddlewares)
        ? require(getAbsolutePath(setupMiddlewares))
        : setupMiddlewares;

    const options = {
        allowedHosts: 'all',
        server: 'https',
        hot: true,
        client: {
            overlay: true,
        },
        historyApiFallback,
        open,
        port: 'auto',
        host: host || (isString(proxy) ? url.parse(proxy).hostname : undefined),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
        },
        ...(isString(proxy)
            ? {
                  devMiddleware: {
                      index: false, // specify to enable root proxying
                  },
                  proxy: {
                      context: () => true,
                      target: proxy,
                      changeOrigin: true,
                      secure: false,
                      xfwd: true,
                      onProxyReq: (proxyReq) => {
                          proxyReq.setHeader('X-WEBPACK-DEV-SERVER', true);
                      },
                  },
              }
            : {
                  proxy,
              }),
        ...(finalSetupMiddlewares !== null
            ? {
                  setupMiddlewares: finalSetupMiddlewares,
              }
            : {}),
        ...otherOpts,
    };
    const server = new WebpackDevServer(options, compiler);
    return server;
};

export default createWebpackServer;
