import { Command } from 'commander';
import setupWebpackCommand from '../setupWebpackCommand';
import createWebpackCompiler from '../createWebpackCompiler';
import createWebpackConfig from '../createWebpackConfig';
import getOptionsFromPackage from '../getOptionsFromPackage';

const command = new Command('build');

setupWebpackCommand(command)
    .description('Build project')
    .option('-o, --output-path <path>', 'Output path', './dist')
    .action((entry) => {
        // Get options
        const { config: customConfig = null, env, packageJson, ...commandOptions } = command.opts();
        const packageOptions = getOptionsFromPackage(packageJson);
        const finalOptions = {
            ...commandOptions,
            ...packageOptions,
        };

        // Set environment
        process.env.NODE_ENV = env;

        // Create webpack config
        const config =
            customConfig !== null
                ? require(customConfig)
                : createWebpackConfig(entry, finalOptions);

        // Create compiler
        const compiler = createWebpackCompiler(config);

        // Run compiler
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                console.error(
                    err ||
                        stats.toString({
                            colors: true,
                            errorDetails: true,
                        }),
                );
                process.exit(1);
            }

            console.log(
                stats.toString({
                    colors: true,
                }),
            );
        });
    });

export default command;
