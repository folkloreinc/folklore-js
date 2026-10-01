/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import isString from 'lodash/isString';
import url from 'url';
import WebpackDevServer from 'webpack-dev-server';

import createWebpackCompiler from './createWebpackCompiler';
import getAbsolutePath from './getAbsolutePath';
import getValetCertificate from './getValetCertificate';

const createWebpackServer = (config, opts = {}) => {
    const compiler = createWebpackCompiler(config);
    const {
        proxy = undefined,
        host = null,
        open = true,
        indexPath = '/index.html',
        setupMiddlewares = null,
        headers = null,
        serverType = 'https',
        ...otherOpts
    } = opts;
    const {
        historyApiFallback = typeof proxy === 'undefined'
            ? {
                  index: indexPath,
                  disableDotRule: true,
              }
            : undefined,
    } = opts;
    const finalSetupMiddlewares = isString(setupMiddlewares)
        ? require(getAbsolutePath(setupMiddlewares))
        : setupMiddlewares;

    // Serve with the Valet certificate of the proxied site, or of the host when there is no proxy,
    // when it exists, so the browser trusts the dev server on the same domain as the site.
    let certificateHostname = null;
    if (isString(proxy)) {
        certificateHostname = url.parse(proxy).hostname;
    } else if (isString(host)) {
        certificateHostname = host;
    }
    const valetCertificate =
        serverType === 'https' ? getValetCertificate(certificateHostname) : null;
    const server =
        valetCertificate !== null
            ? {
                  type: 'https',
                  options: {
                      cert: fs.readFileSync(valetCertificate.cert),
                      key: fs.readFileSync(valetCertificate.key),
                  },
              }
            : serverType;

    const options = {
        allowedHosts: 'all',
        server,
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
            ...headers,
        },
        ...(isString(proxy)
            ? {
                  devMiddleware: {
                      index: false, // specify to enable root proxying
                  },
                  proxy: [
                      {
                          context: () => true,
                          target: proxy,
                          changeOrigin: true,
                          secure: false,
                          xfwd: true,
                          onProxyReq: (proxyReq) => {
                              proxyReq.setHeader('X-WEBPACK-DEV-SERVER', true);
                          },
                      },
                  ],
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
    return new WebpackDevServer(options, compiler);
};

export default createWebpackServer;
