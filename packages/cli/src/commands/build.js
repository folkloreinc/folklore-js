import { Command } from 'commander';
import path from 'path';
import dotenv from 'dotenv';
import setupWebpackCommand from '../setupWebpackCommand';
import createWebpackCompiler from '../createWebpackCompiler';
import createWebpackConfig from '../createWebpackConfig';
import getOptionsFromPackage from '../getOptionsFromPackage';
import getOptionsFromEnv from '../getOptionsFromEnv';

const command = new Command('build');

setupWebpackCommand(command)
    .description('Build project')
    .option('-o, --output-path <path>', 'Output path')
    .action((entry) => {
        // Get options
        const {
            config: customConfig = null,
            env = 'production',
            packageJson = './package.json',
            loadEnv = false,
            envFile = null,
            ...commandOptions
        } = command.opts();

        if (loadEnv) {
            dotenv.config({ path: envFile !== null ? envFile : path.join(process.cwd(), '.env') });
        }

        // Get options
        const packageOptions = getOptionsFromPackage(packageJson);
        const envOptions = getOptionsFromEnv();
        const finalOptions = {
            ...packageOptions,
            ...envOptions,
            ...commandOptions,
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
