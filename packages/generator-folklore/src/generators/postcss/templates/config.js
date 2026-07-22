const postcssGlobalData = require('@csstools/postcss-global-data');
const postcssCustomMedia = require('postcss-custom-media');
const postcssImport = require('postcss-import');
const postcssNormalize = require('postcss-normalize');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    plugins: [
        postcssImport({}),
        postcssGlobalData({
            files: [
                './resources/styles/theme/medias.css',
            ],
        }),
        postcssCustomMedia({}),
        postcssPresetEnv({}),
        postcssNormalize({}),
    ],
};
