import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

export default {
    lossless: {
        plugins: [
            imageminGifsicle({
                interlaced: false,
            }),
            imageminJpegtran({ progressive: true }),
            imageminOptipng({ optimizationLevel: 5 }),
            imageminSvgo({
                plugins: [
                    { removeViewBox: false },
                    {
                        name: 'addAttributesToSVGElement',
                        params: {
                            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                        },
                    },
                ],
            }),
        ],
    },
    losslessWebpack: {
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
                        { removeViewBox: false },
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
            imageminGifsicle({
                interlaced: false,
            }),
            imageminMozjpeg(),
            imageminPngquant(),
            imageminSvgo({
                plugins: [
                    { removeViewBox: false },
                    {
                        name: 'addAttributesToSVGElement',
                        params: {
                            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                        },
                    },
                ],
            }),
        ],
    },
};
