<% if(compile) { %>const path = require('path');

<% } %>const BABEL_ENV = process.env.BABEL_ENV || process.env.NODE_ENV || '';<% if(compile) { %>
const compiling = BABEL_ENV === 'es' || BABEL_ENV === 'cjs';<% } %>

const presets = [
    ['env', BABEL_ENV === 'test' ? {} : {
        modules: BABEL_ENV === 'cjs' ? 'commonjs' : false,
        targets: {
            browsers: [
                '> 1%',
                'last 5 versions',
                'ios >= 8',
                'ie >= 10',
            ],
        },
        useBuiltIns: true,
    }],
    'react',
];

const plugins = [
    'syntax-dynamic-import',
    ['transform-object-rest-spread', {
        useBuiltIns: true,
    }],<% if(transformRuntime) { %>
    ['transform-runtime', {
        helpers: true,
        polyfill: false,
        regenerator: true,
        moduleName: 'babel-runtime',
    }],<% } %>
];

<% if(hotReload) { %>if (BABEL_ENV === 'dev') {
    plugins.push('react-hot-loader/babel');
} else <% } %>if (BABEL_ENV === 'test') {
    plugins.push('dynamic-import-node');
}
<% if(compile) { %>
if (compiling) {
    plugins.push(['css-modules-transform', {
        preprocessCss: path.join(__dirname, './lib/process-scss.js'),
        extensions: ['.css', '.scss'],
        generateScopedName: path.join(__dirname, './lib/generateScopedName.js'),
    }]);
    plugins.push([path.join(__dirname, './lib/babel-plugin-transform-require-ignore'), {
        extensions: ['.global.scss'],
    }]);
<% if(reactIntl) { %>    if (BABEL_ENV === 'es') {
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
