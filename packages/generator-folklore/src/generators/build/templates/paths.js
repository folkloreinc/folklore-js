/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(pathStr, needsSlash) {
    const hasSlash = pathStr.endsWith('/');
    if (hasSlash && !needsSlash) {
        return pathStr.substr(pathStr, pathStr.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${pathStr}/`;
    }
    return pathStr;
}

// eslint-disable-next-line global-require, import/no-dynamic-require
const getPublicUrl = appPackageJson => (envPublicUrl || require(appPackageJson).homepage);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appBuild: resolveApp('<%= buildPath %>'),
    appPublic: resolveApp('<%= publicPath %>'),
    appIndexJs: resolveApp('<%= entryPath %>'),<% if (htmlPath !== null) { %>
    appHtml: resolveApp('<%= htmlPath %>'),<% } %>
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('<%= srcPath %>'),
    testsSetup: resolveApp('tests/setupTests.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    copyPaths: [<% (copyPaths || []).forEach((dir) => { %>
        resolveApp('<%= dir %>'),<%
    }) %>],
    emptyPaths: [<% (emptyPaths || []).forEach((dir) => { %>
        resolveApp('<%= dir %>'),<%
    }) %>],
    watchPaths: [<% (watchPaths || []).forEach((dir) => { %>
        resolveApp('<%= dir %>'),<%
    }) %>],
};

module.exports.srcPaths = [module.exports.appSrc];
