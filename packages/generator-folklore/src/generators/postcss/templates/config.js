const postcssPresetEnv = require('postcss-preset-env');
const postcssNormalize = require('postcss-normalize');
const postcssCustomMedia = require('postcss-custom-media');
const postcssImport = require('postcss-import');

const postcssGlobalData = require('@csstools/postcss-global-data');

module.exports = {
    plugins: [
        postcssImport({}),
        // postcssGlobalData({
        //     files: [
        //         'src/styles/theme/variables.css',
        //     ],
        // }),
        postcssCustomMedia({}),
        postcssPresetEnv({}),
        postcssNormalize({}),
    ],
};
