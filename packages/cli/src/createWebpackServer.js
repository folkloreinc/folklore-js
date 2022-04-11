import url from 'url';
import { isString } from 'lodash';
import WebpackDevServer from 'webpack-dev-server';
import createWebpackCompiler from './createWebpackCompiler';

const createWebpackServer = (config, opts = {}) => {
    const compiler = createWebpackCompiler(config);
    const { proxy = undefined, host = null, open = true, ...otherOpts } = opts;
    const { historyApiFallback = typeof proxy === 'undefined' } = opts;
    const options = {
        allowedHosts: 'all',
        server: 'https',
        hot: true,
        client: {
            overlay: true,
        },
        historyApiFallback: historyApiFallback === true ? {
            index: 'index.html',
        } : historyApiFallback,
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
        ...otherOpts,
    };
    const server = new WebpackDevServer(options, compiler);
    return server;
};

export default createWebpackServer;
