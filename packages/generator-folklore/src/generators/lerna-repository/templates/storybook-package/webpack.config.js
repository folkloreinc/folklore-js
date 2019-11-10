const path = require('path');
const webpackConfig = require(path.join(__dirname, '../.storybook/webpack.config'));
module.exports = async ({ config: storybookBaseConfig }) => {
    const config = await webpackConfig({ config: storybookBaseConfig });

    config.module.rules.push({
        test: require.resolve('./getStories.js'),
        use: [
            {
                loader: 'val-loader',
            },
        ],
    });

    return config;
};
