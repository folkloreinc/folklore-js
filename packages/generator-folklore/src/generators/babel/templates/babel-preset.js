<% if(hasCompile) { %>const path = require('path');

<% } %>const env = process.env.BABEL_ENV || process.env.NODE_ENV;
const isEnvDevelopment = env === 'development';
const isEnvProduction = env === 'production';
const isEnvTest = env === 'test';<% if(hasCompile) { %>
const isCommonJS = env === 'cjs';
const isCompiling = env === 'es' || env === 'cjs';<% } %>

const presets = [
    ['env', isEnvTest ? {
        targets: {
            node: 'current',
        },
    } : {
        modules: <% if(hasCompile) { %>isCommonJS ? 'commonjs' : false<% } else { %>false<% } %>,
        targets: {
            ie: 9,
        },
        useBuiltIns: false,
    }],
    'react',
];

const plugins = [
    'syntax-dynamic-import',
    ['transform-object-rest-spread', {
        useBuiltIns: true,
    }],<% if(hasTransformRuntime) { %>
    ['transform-runtime', {
        helpers: true,
        polyfill: false,
        regenerator: true,
        moduleName: 'babel-runtime',
    }],<% } %>
];

if (isEnvTest) {
    plugins.push('dynamic-import-node');
}
<% if(hasCompile) { %>
if (isCompiling) {
    plugins.push(['css-modules-transform', {
        preprocessCss: path.join(__dirname, './utils/processScss.js'),
        extensions: ['.css', '.scss'],
        generateScopedName: path.join(__dirname, './utils/getLocalIdent.js'),
    }]);
    plugins.push([path.join(__dirname, './utils/transformRequireIgnore'), {
        extensions: ['.global.scss'],
    }]);
<% if(hasReactIntl) { %>    if (isCompiling && !isCommonJS) {
        plugins.push(['react-intl', {
            messagesDir: './intl/messages/',
        }]);
    }<% } %>
}
<% } %>
module.exports = {
    presets,
    plugins,
};
