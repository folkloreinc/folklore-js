import url from 'url';
import isString from 'lodash/isString';
import WebpackDevServer from 'webpack-dev-server';
import createWebpackCompiler from './createWebpackCompiler';

const createWebpackServer = (config, opts = {}) => {
    const compiler = createWebpackCompiler(config);
    const { proxy = null, host = null, ...otherOpts } = opts;
    const options = {
        allowedHosts: 'all',
        server: 'https',
        hot: true,
        client: {
            overlay: true,
        },
        open: true,
        port: 'auto',
        host: host || (isString(proxy) ? url.parse(proxy).hostname : null),
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
                      ws: true,
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
