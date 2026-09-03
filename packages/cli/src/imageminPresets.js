export default {
    lossless: {
        plugins: [
            [
                'gifsicle',
                {
                    interlaced: false,
                },
            ],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            [
                'svgo',
                {
                    plugins: [
                        {
                            name: 'removeViewBox',
                            active: false,
                        },
                        {
                            name: 'addAttributesToSVGElement',
                            params: {
                                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                            },
                        },
                    ],
                },
            ],
        ],
    },
    lossy: {
        plugins: [
            ['gifsicle', { interlaced: false }],
            ['mozjpeg', {}],
            ['pngquant', {}],
            [
                'svgo',
                {
                    plugins: [
                        {
                            name: 'removeViewBox',
                            active: false,
                        },
                        {
                            name: 'addAttributesToSVGElement',
                            params: {
                                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                            },
                        },
                    ],
                },
            ],
        ],
    },
};
