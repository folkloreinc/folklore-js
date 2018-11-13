module.exports = {
    /**
     * Webpack
     */
    webpack: {
        filename: env => (env === 'dev' ? 'js/main.js' : 'js/main.js'),
        chunkFilename: env => (env === 'dev' ? 'js/[name].chunk.js' : 'js/[name].chunk.js'),
        publicPath: '/',

        cssRegex: /\.global\.css$/,
        cssModuleRegex: /\.css$/,
        sassRegex: /\.global\.(scss|sass)$/,
        sassModuleRegex: /\.(scss|sass)$/,

        cssFilename: env => (env === 'dev' ? 'css/[name]-[contenthash].css' : 'css/[name].css'),
        cssChunkFilename: () => 'css/[name].[contenthash:8].chunk.css',
        cssLocalIdent: '[name]-[local]',

        imageFilename: env => (env === 'dev' ? 'img/[name]-[hash:6].[ext]' : 'img/[name].[ext]'),
        imagePublicPath: '/',

        mediaFilename: env => (env === 'dev' ? 'medias/[name]-[hash:6].[ext]' : 'medias/[name].[ext]'),
        mediaPublicPath: '/',

        fontFilename: env => (env === 'dev' ? 'fonts/[name]-[hash:6].[ext]' : 'fonts/[name].[ext]'),
    },
<% if (hasServer) { %>
    /**
     * Webpack Dev Server
     */
    webpackDevServer: {
<% if (hasServerProxy) {
%>        browserHost: '<%= serverBrowserHost %>',
        proxy: '<%= serverProxyHost %>',<% } %>
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
