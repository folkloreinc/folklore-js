<% if(hasCompile) { %>const path = require('path');

<% } %>const env = process.env.BABEL_ENV || process.env.NODE_ENV;
const isEnvDevelopment = env === 'development';
const isEnvProduction = env === 'production';
const isEnvTest = env === 'test';<% if(hasCompile) { %>
const isCommonJS = env === 'cjs';
const isCompiling = env === 'es' || env === 'cjs';<% } %>

const presets = [
    [require.resolve('@babel/preset-env'), isEnvTest ? {
        targets: {
            node: 'current',
        },
    } : {
        modules: <% if(hasCompile) { %>isCommonJS ? 'commonjs' : false<% } else { %>false<% } %>,
        targets: {
            ie: 9,
        },
    }],
    require.resolve('@babel/preset-react'),
];

const plugins = [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),<% if(hasTransformRuntime) { %>
    [require.resolve('@babel/plugin-transform-runtime'), {
        helpers: true,
        polyfill: false,
        regenerator: true,
    }],<% } %>
];

if (isEnvTest) {
    plugins.push(require.resolve('babel-plugin-dynamic-import-node'));
}
<% if(hasCompile) { %>
if (isCompiling) {
    plugins.push([require.resolve('babel-plugin-css-modules-transform'), {
        preprocessCss: path.join(__dirname, './utils/processScss.js'),
        extensions: ['.css', '.scss'],
        generateScopedName: path.join(__dirname, './utils/getLocalIdent.js'),
    }]);
    plugins.push([path.join(__dirname, './utils/transformRequireIgnore'), {
        extensions: ['.global.scss'],
    }]);
<% if(hasReactIntl) { %>    if (isCompiling && !isCommonJS) {
        plugins.push([require.resolve('babel-plugin-react-intl'), {
            messagesDir: './intl/messages/',
        }]);
    }<% } %>
}
<% } %>
module.exports = () => ({
    presets,
    plugins,
});
