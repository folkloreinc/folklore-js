import { Command } from 'commander';
import setupWebpackCommand from '../setupWebpackCommand';
import createWebpackServer from '../createWebpackServer';
import createWebpackConfig from '../createWebpackConfig';
import getOptionsFromPackage from '../getOptionsFromPackage';

const command = new Command('serve');

setupWebpackCommand(command, {
    env: 'development',
})
    .description('Start development server')
    .option('--package-json <path>', 'Path to package.json', './package.json')
    .option('-p, --proxy <host>', 'Host to proxy')
    .option('-o, --open <url>', 'Url to open')
    .action(async (entry) => {
        // Get options
        const { config: customConfig = null, env, packageJson, ...commandOptions } = command.opts();
        const packageOptions = getOptionsFromPackage(packageJson);
        const { proxy, open, ...finalOptions } = {
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

        // Create server
        const server = createWebpackServer(config, {
            proxy,
            open,
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
