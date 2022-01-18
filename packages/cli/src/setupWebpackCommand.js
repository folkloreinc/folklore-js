const setupWebpackCommand = (command) => {
    command
        .argument('<entry...>', 'entry points')
        .option('-c, --config <config>', 'Path to custom config file')
        .option('-e, --env <env>', 'Environment')
        .option('-s, --src-path <path>', 'Source path')
        .option('--package-json <path>', 'Path to package.json')
        .option('--public-path <path>', 'Public path')
        .option('--html-path <path>', 'Path to HTML index file')
        .option('--html-template-parameters <path>', 'Path to a javascript file that will get passe as template parameters')
        .option('--js-output-path <path>', 'Output path for javascript files')
        .option('--css-output-path <path>', 'Output path for CSS files')
        .option('--asset-output-path <path>', 'Output path for asset files')
        .option('--define-env <...env>', 'Add extra environment variables to the DefinePlugin')
        .option('--disable-source-map', 'Disable source map')
        .option('--disable-image-optimization', 'Disable images optimization')
        .option(
            '--image-optimization <preset>',
            'Set images optimization preset (lossless, lossy)',
        )
        .option('--loaders <path>', 'Path to loaders file')
        .option('--plugins <path>', 'Path to plugins file')
        .option('--merge-config <path>', 'Path to merge a config file')
        .option(
            '--formatjs-id-interpolation-pattern <pattern>',
            'FormatJS id interpolation pattern',
        )
        .option('--analyzer', 'Start analyzer')
        .option('--load-env', 'Load environment file')
        .option('--env-file [path]', 'Path to environment file');

    return command;
};

export default setupWebpackCommand;
