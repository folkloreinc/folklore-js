/* eslint-disable import/no-extraneous-dependencies */
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const prettyBytes = require('pretty-bytes');
const buildConfig = require('./config');
/* eslint-enable import/no-extraneous-dependencies */

const imageminConfig = buildConfig.imagemin;

function minifyImage(srcPath, output) {
    const stats = fs.statSync(srcPath);
    const originalSize = stats.size;

    imagemin([srcPath], output, {
        plugins: [
            imageminMozjpeg(),
            imageminPngquant(imageminConfig.pngquant),
            imageminSvgo(imageminConfig.svgo),
        ],
    }).then((files) => {
        let saved;
        let optimizedSize;
        let percent;
        let savedMsg;
        let msg;
        const fl = files.length;
        for (let i = 0; i < fl; i += 1) {
            optimizedSize = files[i].data.length;
            saved = originalSize - optimizedSize;
            percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
            savedMsg = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
            msg = saved > 0 ? savedMsg : 'already optimized';
            // eslint-disable-next-line no-console
            console.log(`${chalk.green('✔')} ${srcPath} ${chalk.yellow('>')} ${files[i].path} - ${msg}`);
        }
    });
}

const processFile = fileGlob => (
    (er, files) => {
        const basePath = fileGlob.substr(0, fileGlob.indexOf('*'));
        let srcPath;
        let relativePath;
        const fl = files.length;
        for (let i = 0; i < fl; i += 1) {
            srcPath = files[i];
            relativePath = srcPath.replace(basePath, '');
            minifyImage(srcPath, path.join(imageminConfig.output, path.dirname(relativePath)));
        }
    }
);

for (let i = 0, fl = imageminConfig.files.length; i < fl; i += 1) {
    glob(imageminConfig.files[i], {}, processFile(imageminConfig.files[i]));
}
