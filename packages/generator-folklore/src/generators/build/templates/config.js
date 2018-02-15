module.exports = {

    <% if(hasBrowserSync) { %>/**
     * Browsersync
     */
    browsersync: {
        server: {
            baseDir: [
<% browserSyncBaseDir.forEach((dir) => { %>                '<%=dir%>',
<% }) %>            ],
            index: 'index.html',
        },<% if(browserSyncProxy) { %>

        host: '<%= browserSyncHost %>',
        proxy: '<%= browserSyncProxy %>',
        https: false,
        <% } %>
        files: [
<% browserSyncFiles.forEach((file) => { %>            '<%=file%>',
<% }) %>        ],
        ghostMode: false,
    },

    /**
     * Webpack
     */
    webpack: {
        cssFilename: env => (env === 'dev' ? '[name]-[contenthash].css' : '[name].css'),
        cssLocalIdent: '[name]-[local]',

        imageFilename: env => (env === 'dev' ? 'img/[name]-[hash:6].[ext]' : 'img/[name].[ext]'),
        imagePublicPath: '/',

        fontFilename: env => (env === 'dev' ? 'fonts/[name]-[hash:6].[ext]' : 'fonts/[name].[ext]'),
        fontPublicPath: '/',
    },

    /**
     * Webpack middleware
     */
    webpackMiddleware: {
        noInfo: false,

        quiet: false,

        lazy: false,

        watchOptions: {
            aggregateTimeout: 300,
            poll: false,
            ignored: /node_modules/,
        },

        stats: {
            colors: true,
        },
    },<% } %>

    /**
     * Imagemin
     */
    imagemin: {
        files: [
            '<%= imagesSrcPath %>',
        ],
        output: '<%= imagesDestPath %>',

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
    },

    /**
     * PostCSS
     */
    postcss: {
        map: {
            inline: false,
        },
        plugins: {
            autoprefixer: {},
            cssnano: {
                preset: 'default',
                zindex: false,
                discardUnused: {
                    fontFace: false,
                },
            },
        },
        env: {
            dev: {
                plugins: {
                    autoprefixer: false,
                    cssnano: false,
                },
            },
        },
    },

    /**
     * Modernizr
     */
    modernizr: {
        cache: true,

        devFile: false,

        dest: '<%= modernizrDestPath %>',

        options: [
            'addTest',
            'html5printshiv',
            'testProp',
            'fnBind',
        ],

        uglify: false,

        tests: [],

        excludeTests: ['hidden'],

        crawl: true,

        useBuffers: false,

        files: {
            src: [
                '*[^(g|G)runt(file)?].{js,css,scss}',
                '**[^node_modules]/**/*.{js,css,scss}',
                '!lib/**/*',
            ],
        },

        customTests: [],
    },

};
