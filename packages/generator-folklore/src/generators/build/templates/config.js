/* eslint-disable no-console, global-require */
/* eslint-disable import/no-extraneous-dependencies, import/no-dynamic-require, import/order */
module.exports = {
    /**
     * Webpack
     */
    webpack: {
        filename: <% if (hasHtml) { %>() => 'js/main-[hash:8].js'<% } else { %>() => 'js/main.js'<% } %>,
        chunkFilename: () => 'js/[name]-[hash:8].chunk.js',
        publicPath: '/',

        cssRegex: /\.global\.css$/,
        cssModuleRegex: /\.css$/,
        sassRegex: /\.global\.(scss|sass)$/,
        sassModuleRegex: /\.(scss|sass)$/,

        cssFilename: <% if (hasHtml) { %>() => 'css/[name]-[contenthash:8].css'<% } else { %>() => 'css/[name].css'<% } %>,
        cssChunkFilename: () => 'css/[name]-[contenthash:8].chunk.css',
        cssLocalIdent: '[name]-[local]',

        imageFilename: () => 'img/[name]-[hash:8].[ext]',
        imagePublicPath: '/',

        mediaFilename: () => 'medias/[name]-[hash:8].[ext]',
        mediaPublicPath: '/',

        fontFilename: () => 'fonts/[name]-[hash:8].[ext]',
    },
<% if (hasServer) { %>
    /**
     * Webpack Dev Server
     */
    webpackDevServer: {
<% if (hasServerProxy) {
%>        browserHost: '<%= serverBrowserHost %>',
        proxy: '<%= serverProxyHost %>',
        https: false,<% } %>
    },<% } %>

    /**
     * PostCSS
     */
    postcss: {
        ident: 'postcss',
        plugins: [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
            }),
        ],
    },

<% if (hasImagemin) {
%>    /**
     * Imagemin
     */
    imagemin: {
        files: [<% (imageminFiles || []).forEach((file) => {
%>            '<%= file %>',
<% }) %>        ],
        output: '<%= imageminOutputPath %>',

        pngquant: {
            quality: '65-80',
        },

        svgo: {
            plugins: [
                {
                    removeViewBox: false,
                },
            ],
        },
    },<% } %>
};
