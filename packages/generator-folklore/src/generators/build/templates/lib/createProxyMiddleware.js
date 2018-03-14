/* eslint-disable import/no-extraneous-dependencies */
const proxyMiddleware = require('proxy-middleware');
const servestaticMiddleware = require('serve-static');
const url = require('url');
const path = require('path');
const fs = require('fs');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = (proxy, opts) => {
    const options = {
        staticDirs: [],
        ...opts,
    };

    const proxyHost = url.parse(proxy);
    const middlewares = [];

    /**
     * Static middleware
     */
    const baseDirs = options.staticDirs;
    const serveStaticMiddlewares = {};
    for (let i = 0, bl = baseDirs.length; i < bl; i += 1) {
        serveStaticMiddlewares[baseDirs[i]] = servestaticMiddleware(baseDirs[i]);
    }
    const staticMiddleware = (req, res, next) => {
        const requestUrl = url.parse(req.url);
        const urlPath = requestUrl.pathname;

        const staticMiddlewareKey = Object.keys(serveStaticMiddlewares).find((key) => {
            try {
                const stats = fs.lstatSync(path.join(key, urlPath));
                return stats.isFile();
            } catch (e) {
                // console.error(e);
            }
            return false;
        });

        if (staticMiddlewareKey) {
            return serveStaticMiddlewares[staticMiddlewareKey](req, res, next);
        }

        return next();
    };
    middlewares.push(staticMiddleware);

    /**
     * Proxy middleware
     */
    const proxyMiddlewareOptions = url.parse(`${proxyHost.protocol}//${proxyHost.host}`);
    proxyMiddlewareOptions.preserveHost = true;
    proxyMiddlewareOptions.via = 'browserSync';
    proxyMiddlewareOptions.rejectUnauthorized = false;
    middlewares.push(proxyMiddleware(proxyMiddlewareOptions));

    return middlewares;
};
