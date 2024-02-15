const setupWebpackCommand = (command) => {
    command
        .argument('<entry...>', 'entry points')
        .option('-c, --config <config>', 'Path to custom config file')
        .option('--package-json <path>', 'Path to package.json')
        // Environment vairables
        .option('-e, --env <env>', 'Environment')
        .option('--load-env', 'Load environment file')
        .option('--define-env <...env>', 'Add extra environment variables to the DefinePlugin')
        .option('--env-file [path]', 'Path to environment file')
        // Paths
        .option('--public-path <path>', 'Public path')
        .option('-s, --src-path <path>', 'Source path')
        .option('--html-path <path>', 'Path to HTML index file')
        .option('--html-output-path <path>', 'Output path for HTML file')
        .option('--js-output-path <path>', 'Output path for javascript files')
        .option('--js-output-filename <name>', 'Output filename for javascript files')
        .option('--js-chunk-output-filename <name>', 'Output filename for javascript chunk files')
        .option('--css-output-path <path>', 'Output path for CSS files')
        .option('--css-output-filename <name>', 'Output filename for CSS files')
        .option('--css-chunk-output-filename <name>', 'Output filename for CSS chunk files')
        .option('--asset-output-path <path>', 'Output path for asset files')
        .option('--asset-output-filename <name>', 'Output filename for asset files')
        // Webpack
        .option('--disable-source-map', 'Disable source map')
        .option('--loaders <path>', 'Path to loaders file')
        .option('--plugins <path>', 'Path to plugins file')
        .option('--merge-config <path>', 'Path to merge a config file')
        .option('--analyzer', 'Start analyzer')
        // Babel
        .option(
            '--babel-preset-env-use-builtins <value>',
            'Set useBuiltIns of @babel/preset-env loader',
        )
        .option('--babel-config-file <value>', 'Set configFile option for babel loader')
        .option('--babel-rc <value>', 'Set babelrc option for babel loader')
        .option('--postcss-config-file [value]', 'Set postcss config file option')
        // Images
        .option('--disable-image-optimization', 'Disable images optimization')
        .option('--image-optimization <preset>', 'Set images optimization preset (lossless, lossy)')
        .option('--image-data-url-max-size <size>', 'Maximum size for data url images')
        // HTML
        .option(
            '--html-template-parameters <path>',
            'Path to a javascript file that will get passe as template parameters',
        )
        // Format.js
        .option(
            '--formatjs-id-interpolation-pattern <pattern>',
            'FormatJS id interpolation pattern',
        )
        .option('--without-formatjs', 'Without FormatJS babel plugin');

    return command;
};

export default setupWebpackCommand;
