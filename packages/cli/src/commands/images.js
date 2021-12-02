import path from 'path';
import { Command } from 'commander';
import favicons from 'favicons';
import fs from 'fs-extra';
import imagemin from 'imagemin';
import getPathsFromGlob from '../getPathsFromGlob';
import imageminPresets from '../imageminPresets';
import getAbsolutePath from '../getAbsolutePath';

const command = new Command('images');

const optimizeCommand = new Command('optimize');
optimizeCommand
    .description('Optimize images')
    .argument('<paths...>')
    .requiredOption('-o, --output-path <path>', 'Output path')
    .option('-r, --relative-path <path>', 'Relative path')
    .option('--lossy', 'Lossy optimization')
    .action(async (srcPaths) => {
        const { outputPath, relativePath = null, lossy = false } = optimizeCommand.opts();
        const absOutputPath = getAbsolutePath(outputPath);
        const absRelativePath = relativePath !== null ? getAbsolutePath(relativePath) : null;
        const imagesPaths = getPathsFromGlob(srcPaths);

        const images = await imagemin(imagesPaths, {
            glob: false,
            ...imageminPresets[lossy ? 'lossy' : 'lossless'],
        });

        const files = await Promise.all([
            ...images.map(
                ({ sourcePath, data }) =>
                    new Promise((resolve, reject) => {
                        const destinationPath = path.join(
                            absOutputPath,
                            relativePath !== null
                                ? path.relative(absRelativePath, sourcePath)
                                : path.basename(sourcePath),
                        );
                        fs.outputFile(destinationPath, data, (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve({
                                destination: destinationPath,
                                source: sourcePath,
                            });
                        });
                    }),
            ),
        ]);

        console.log(files);
    });

const iconsCommand = new Command('icons');
iconsCommand
    .description('Generate icons')
    .argument('<paths...>')
    .requiredOption('-o, --output-path <path>', 'Output path')
    .requiredOption('--public-path <path>', 'Public path', '/')
    .requiredOption('--meta-file <path>', 'Path to a file where meta tags will be outputed')
    .action(async (srcPaths) => {
        const { outputPath, publicPath, metaFile = null } = iconsCommand.opts();
        const absOutputPath = getAbsolutePath(outputPath);
        const icons = getPathsFromGlob(srcPaths);
        const results = await Promise.all(
            icons.map((icon) =>
                favicons(icon, {
                    path: publicPath,
                    icons: {
                        android: false,
                        appleIcon: false,
                        appleStartup: false,
                        favicons: true,
                        windows: false,
                        yandex: false,
                        firefox: false,
                        coast: false,
                    },
                }),
            ),
        );
        const files = await Promise.all([
            ...results.reduce(
                (previous, result) =>
                    [
                        ...previous,
                        ...result.images.map(
                            ({ name, contents }) =>
                                new Promise((resolve, reject) => {
                                    const imagePath = path.join(absOutputPath, name);
                                    fs.outputFile(imagePath, contents, (err) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        resolve(imagePath);
                                    });
                                }),
                        ),
                        metaFile !== null &&
                            new Promise((resolve, reject) => {
                                const metaPath = getAbsolutePath(metaFile);
                                fs.outputFile(metaPath, result.html.join('\n'), (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    resolve(metaPath);
                                });
                            }),
                    ].filter(Boolean),
                [],
            ),
        ]);
        console.log(results, files);
    });

command
    .description('Tools to deal with images')
    .addCommand(optimizeCommand, {
        isDefault: true,
    })
    .addCommand(iconsCommand);

export default command;
