import postcssGlobalData from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';
import postcssImport from 'postcss-import';
import postcssNormalize from 'postcss-normalize';
import postcssPresetEnv from 'postcss-preset-env';

export default {
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
