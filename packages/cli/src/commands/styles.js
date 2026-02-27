/* eslint-disable @typescript-eslint/no-require-imports */
import { Command } from 'commander';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import postcss from 'postcss';
import sass from 'sass';

import getAbsolutePath from '../getAbsolutePath';
import getPathsFromGlob from '../getPathsFromGlob';

const command = new Command('styles');

const buildCommand = new Command('build');
buildCommand
    .description('Optimize images')
    .argument('<paths...>')
    .requiredOption('-o, --output-path <path>', 'Output path')
    .option('-r, --relative-path <path>', 'Relative path')
    .option('-c, --postcss-config-file <path>', 'Postcss config file', './postcss.config.js')
    .action(async (srcPaths) => {
        const { outputPath, relativePath = null, postcssConfigFile = null } = buildCommand.opts();
        const absOutputPath = getAbsolutePath(outputPath);
        const absRelativePath = relativePath !== null ? getAbsolutePath(relativePath) : null;
        const stylesPaths = getPathsFromGlob(srcPaths);
        const postcssConfigPath =
            postcssConfigFile !== null ? getAbsolutePath(postcssConfigFile) : null;

        const { plugins = [] } =
            postcssConfigPath !== null && fs.existsSync(postcssConfigPath)
                ? require(postcssConfigPath)
                : null;
        const postcssCommand = postcss(plugins);

        stylesPaths.forEach((stylePath) => {
            const destinationPath = path.join(
                absOutputPath,
                relativePath !== null
                    ? path.relative(absRelativePath, stylePath)
                    : path.basename(stylePath),
            );

            const result = sass.compile(stylePath, {
                sourceMap: true,
                style: 'compressed',
                loadPaths: [path.join(process.cwd(), 'node_modules')],
            });

            postcssCommand
                .process(result.css, {
                    from: stylePath,
                    to: destinationPath,
                })
                .then((postCssResult) => {
                    mkdirp.sync(path.dirname(destinationPath));
                    fs.writeFileSync(destinationPath, postCssResult.css);

                    console.log(
                        `Generated ${destinationPath} from ${result.stats.entry} in ${result.stats.duration}s`,
                    );
                });
        });
    });

command.description('Tools to deal with styles').addCommand(buildCommand, {
    isDefault: true,
});

export default command;
