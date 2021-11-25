const setupWebpackCommand = (command, opts = {}) => {
    const { env = 'production', srcPath = './src' } = opts;

    command
        .argument('<entry>', 'entry point')
        .option('-c, --config <config>', 'Path to custom config file')
        .option('-e, --env <env>', 'Environment', env)
        .option('-s, --src-path <path>', 'Source path', srcPath)
        .option('--package-json <path>', 'Path to package.json', './package.json')
        .option('--public-path <path>', 'Public path')
        .option('--js-output-path <path>', 'Output path for javascript files')
        .option('--css-output-path <path>', 'Output path for CSS files')
        .option('--asset-output-path <path>', 'Output path for asset files')
        .option('--disable-source-map', 'Disable source map')
        .option('-a, --analyzer', 'Start analyzer');

    return command;
};

export default setupWebpackCommand;
