import { Command } from 'commander';
import path from 'path';
import dotenv from 'dotenv';
import setupWebpackCommand from '../setupWebpackCommand';
import createWebpackServer from '../createWebpackServer';
import createWebpackConfig from '../createWebpackConfig';
import getOptionsFromPackage from '../getOptionsFromPackage';
import getOptionsFromEnv from '../getOptionsFromEnv';

const command = new Command('serve');

setupWebpackCommand(command)
    .description('Start development server')
    .option('-p, --proxy <host>', 'Host to proxy')
    .option('-o, --open <url>', 'Url to open')
    .action(async (entry) => {
        // Get options
        const {
            config: customConfig = null,
            env = 'development',
            packageJson = './package.json',
            loadEnv = false,
            envFile = null,
            loaders = null,
            ...commandOptions
        } = command.opts();

        if (loadEnv) {
            dotenv.config({ path: envFile !== null ? envFile : path.join(process.cwd(), '.env') });
        }

        // Get options
        const packageOptions = getOptionsFromPackage(packageJson);
        const envOptions = getOptionsFromEnv();
        const { proxy, open, host, ...finalOptions } = {
            ...commandOptions,
            ...envOptions,
            ...packageOptions,
            ...(loaders !== null
                ? {
                      loaders: require(loaders),
                  }
                : null),
        };

        // Set environment
        process.env.NODE_ENV = env;

        // Create webpack config
        const config =
            customConfig !== null
                ? require(customConfig)
                : createWebpackConfig(entry, finalOptions);

        // Create server
        const server = createWebpackServer(config, {
            proxy,
            open,
            host,
        });

        // Start server
        await server.start();

        // Handle signal
        ['SIGINT', 'SIGTERM'].forEach((sig) => {
            process.on(sig, async () => {
                await server.stop();
                process.exit();
            });
        });
    });

export default command;
