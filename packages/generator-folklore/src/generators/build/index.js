import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';
import getWebpackEntries from './lib/getWebpackEntries';
import formatWebpackEntries from './lib/formatWebpackEntries';

module.exports = class AppGenerator extends Generator {

    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('path', {
            type: String,
            defaults: './build/',
        });

        this.option('tmp-path', {
            type: String,
            defaults: './.tmp/',
        });

        this.option('src-path', {
            type: String,
            defaults: './src/',
        });

        this.option('dest-path', {
            type: String,
            defaults: './dist/',
        });

        this.option('clean-dest', {
            type: Boolean,
            defaults: false,
        });

        this.option('watch', {
            type: Boolean,
            defaults: true,
        });

        this.option('modernizr', {
            type: Boolean,
            defaults: true,
        });

        this.option('copy', {
            type: Boolean,
            defaults: false,
        });

        this.option('copy-path', {
            type: String,
            defaults: 'src/*.{js,css,html,ico,txt}',
        });

        this.option('js', {
            type: Boolean,
            defaults: true,
        });

        this.option('js-path', {
            type: String,
            defaults: 'js',
        });

        this.option('js-src-path', {
            type: String,
        });

        this.option('js-src-path', {
            type: String,
        });

        this.option('js-tmp-path', {
            type: String,
        });

        this.option('js-dest-path', {
            type: String,
        });

        this.option('webpack-public-path', {
            type: String,
        });

        this.option('webpack-entry', {
            type: String,
        });

        this.option('webpack-entries', {
            type: Object,
        });

        this.option('webpack-dev-entry', {
            type: String,
        });

        this.option('webpack-dev-entries', {
            type: Object,
        });

        this.option('webpack-dev-context', {
            type: String,
        });

        this.option('webpack-dist-entry', {
            type: String,
        });

        this.option('webpack-dist-entries', {
            type: Object,
        });

        this.option('webpack-config', {
            type: Boolean,
            defaults: true,
        });

        this.option('hot-reload', {
            type: Boolean,
            defaults: false,
        });

        this.option('webpack-html', {
            type: Boolean,
            defaults: false,
        });

        this.option('webpack-config-dist', {
            type: Boolean,
            defaults: true,
        });

        this.option('webpack-config-base', {
            type: Boolean,
            defaults: true,
        });

        this.option('webpack-config-dev', {
            type: Boolean,
            defaults: true,
        });

        this.option('webpack-config-path', {
            type: String,
        });

        this.option('webpack-config-base-path', {
            type: String,
        });

        this.option('webpack-config-dist-path', {
            type: String,
        });

        this.option('webpack-config-dev-path', {
            type: String,
        });

        this.option('images', {
            type: Boolean,
            defaults: true,
        });

        this.option('images-path', {
            type: String,
            defaults: 'img',
        });

        this.option('images-src-path', {
            type: String,
        });

        this.option('images-dest-path', {
            type: String,
        });

        this.option('postcss', {
            type: Boolean,
            defaults: true,
        });

        this.option('scss', {
            type: Boolean,
            defaults: true,
        });

        this.option('scss-path', {
            type: String,
            defaults: 'scss',
        });

        this.option('css-path', {
            type: String,
            defaults: 'css',
        });

        this.option('scss-src-path', {
            type: String,
        });

        this.option('scss-tmp-path', {
            type: String,
        });

        this.option('scss-dest-path', {
            type: String,
        });

        this.option('browsersync', {
            type: Boolean,
            defaults: true,
        });

        this.option('browsersync-host', {
            type: String,
        });

        this.option('browsersync-proxy', {
            type: String,
        });

        this.option('browsersync-base-dir', {
            type: String,
            defaults: './',
        });

        this.option('browsersync-files', {
            type: String,
            defaults: './*',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Build tools Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(this.prompts.project_name);
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers['project-name']) {
                            this.options['project-name'] = answers['project-name'];
                        }
                    });
            },
        };
    }

    get writing() {
        return {
            config() {
                const srcPath = _.get(this.options, 'src-path');
                const destPath = _.get(this.options, 'dest-path');

                const buildPath = _.get(this.options, 'path', false);
                const tmpPath = _.get(this.options, 'tmp-path');
                const hasBrowserSync = _.get(this.options, 'browsersync', false);
                const browserSyncHost = _.get(this.options, 'browsersync-host', null);
                const browserSyncProxy = _.get(this.options, 'browsersync-proxy', null);
                const browserSyncBaseDir = _.get(this.options, 'browsersync-base-dir', []);
                const browserSyncFiles = _.get(this.options, 'browsersync-files', []);
                const jsPath = _.get(this.options, 'js-path', 'js');
                const jsTmpPath = _.get(this.options, 'js-tmp-path', null) || path.join(tmpPath, jsPath);

                const imagesPath = _.get(this.options, 'images-path', 'img');
                const imagesSrcPath = _.get(this.options, 'images-src-path', null) || path.join(srcPath, imagesPath, '**/*.{jpg,png,jpeg,gif,svg}');
                const imagesDestPath = _.get(this.options, 'images-dest-path', null) || path.join(destPath, imagesPath);

                const templateData = {
                    hasBrowserSync,
                    browserSyncHost: browserSyncHost && browserSyncHost.length ?
                        browserSyncHost : null,
                    browserSyncProxy: browserSyncProxy && browserSyncProxy.length ?
                        browserSyncProxy : null,
                    browserSyncBaseDir: _.isArray(browserSyncBaseDir) ?
                        browserSyncBaseDir : browserSyncBaseDir.split(','),
                    browserSyncFiles: _.isArray(browserSyncFiles) ?
                        browserSyncFiles : browserSyncFiles.split(','),
                    imagesSrcPath,
                    imagesDestPath,
                    modernizrDestPath: path.join(jsTmpPath, 'modernizr.js'),
                };

                const configSrcPath = this.templatePath('config.js');
                const configDestPath = this.destinationPath(path.join(buildPath, 'config.js'));
                this.fs.copyTpl(configSrcPath, configDestPath, templateData);
            },

            browsersync() {
                if (!_.get(this.options, 'browsersync', false)) {
                    return;
                }

                if (!this.options.browsersync) {
                    return;
                }

                const templateData = {
                    options: this.options,
                };

                const buildPath = _.get(this.options, 'path');
                const srcPath = this.templatePath('browsersync.js');
                const destPath = this.destinationPath(path.join(buildPath, 'browsersync.js'));
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            modernizr() {
                if (!_.get(this.options, 'modernizr', false)) {
                    return;
                }

                const destPath = _.get(this.options, 'dest-path');
                const jsPath = _.get(this.options, 'js-path', 'js');
                const jsDestPath = _.get(this.options, 'js-dest-path', null) || path.join(destPath, jsPath);

                const templateData = {
                    destPath: path.join(jsDestPath, 'modernizr.js'),
                };

                const buildPath = _.get(this.options, 'path');
                const modernizrSrcPath = this.templatePath('modernizr.js');
                const modernizrDestPath = this.destinationPath(path.join(buildPath, 'modernizr.js'));
                this.fs.copyTpl(modernizrSrcPath, modernizrDestPath, templateData);
            },

            postcssConfig() {
                if (!_.get(this.options, 'scss', false) && !_.get(this.options, 'postcss', false)) {
                    return;
                }

                const templateData = {};

                const buildPath = _.get(this.options, 'path');
                const srcPath = this.templatePath('postcss.config.js');
                const destPath = this.destinationPath(path.join(buildPath, 'postcss.config.js'));
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            imagemin() {
                if (!_.get(this.options, 'images', false)) {
                    return;
                }

                const templateData = {};

                const buildPath = _.get(this.options, 'path');
                const srcPath = this.templatePath('imagemin.js');
                const destPath = this.destinationPath(path.join(buildPath, 'imagemin.js'));
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            lib() {
                const buildPath = _.get(this.options, 'path');
                const srcPath = this.templatePath('lib');
                const destPath = this.destinationPath(path.join(buildPath, 'lib'));
                this.fs.copy(srcPath, destPath);
            },

            webpack() {
                if (!_.get(this.options, 'js', false)) {
                    return;
                }

                const buildPath = _.get(this.options, 'path');
                const tmpPath = _.get(this.options, 'tmp-path');
                const srcPath = _.get(this.options, 'src-path');
                const destPath = _.get(this.options, 'dest-path');
                const jsPath = _.get(this.options, 'js-path', 'js');
                const jsTmpPath = _.get(this.options, 'js-tmp-path', null) || path.join(tmpPath, jsPath);
                const jsSrcPath = _.get(this.options, 'js-src-path', null) || path.join(srcPath, jsPath);
                const jsDestPath = _.get(this.options, 'js-dest-path', null) || path.join(destPath, jsPath);
                const devContext = _.get(this.options, 'webpack-dev-context', null);
                const publicPath = _.get(this.options, 'webpack-public-path', null) || '/';
                const entries = getWebpackEntries(
                    _.get(this.options, 'webpack-entry', null),
                    _.get(this.options, 'webpack-entries', []),
                );
                const distEntries = getWebpackEntries(
                    _.get(this.options, 'webpack-dist-entry', null),
                    _.get(this.options, 'webpack-dist-entries', null),
                );
                let devEntries = getWebpackEntries(
                    _.get(this.options, 'webpack-dev-entry', null),
                    _.get(this.options, 'webpack-dev-entries', null),
                );
                if (this.options['hot-reload']) {
                    if (typeof devEntries === 'undefined' || devEntries === null) {
                        devEntries = _.clone(entries);
                    }
                    const hotReloadEntries = [
                        'webpack/hot/dev-server',
                        'webpack-hot-middleware/client?reload=true',
                    ];
                    if (_.isObject(devEntries)) {
                        const firstKey = Object.keys(devEntries)[0];
                        const value = devEntries[firstKey];
                        devEntries[firstKey] = [
                            ...hotReloadEntries,
                            ...(!_.isArray(value) ? [value] : value),
                        ];
                    } else if (_.isString(devEntries) || _.isArray(devEntries)) {
                        devEntries = [
                            ...hotReloadEntries,
                            ...(!_.isArray(devEntries) ? [devEntries] : devEntries),
                        ];
                    }
                }

                const templateData = {
                    _,
                    options: this.options,
                    srcPath: jsSrcPath,
                    devContext,
                    tmpPath: jsTmpPath,
                    destPath: jsDestPath,
                    publicPath,
                    entries,
                    entriesFormatted: formatWebpackEntries(entries),
                    distEntries,
                    distEntriesFormatted: formatWebpackEntries(distEntries),
                    devEntries,
                    devEntriesFormatted: formatWebpackEntries(devEntries),
                };

                let configSrcPath;
                let configDestPath;

                if (_.get(this.options, 'webpack-config')) {
                    configSrcPath = _.get(this.options, 'webpack-config-path') || this.templatePath('webpack.config.js');
                    configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.js'));
                    this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                }

                if (_.get(this.options, 'webpack-config-base')) {
                    configSrcPath = _.get(this.options, 'webpack-config-base-path') || this.templatePath('webpack.config.base.js');
                    configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.base.js'));
                    this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                }

                if (_.get(this.options, 'webpack-config-dist')) {
                    configSrcPath = _.get(this.options, 'webpack-config-dist-path') || this.templatePath('webpack.config.dist.js');
                    configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.dist.js'));
                    this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                }

                if (this.options.browsersync && _.get(this.options, 'webpack-config-dev')) {
                    configSrcPath = _.get(this.options, 'webpack-config-dev-path') || this.templatePath('webpack.config.dev.js');
                    configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.dev.js'));
                    this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                }
            },

            packageJSONScripts() {
                const buildPath = _.get(this.options, 'path');
                const tmpPath = _.get(this.options, 'tmp-path');
                const srcPath = _.get(this.options, 'src-path');
                const destPath = _.get(this.options, 'dest-path');

                const scripts = {
                    'clean:tmp': `rm -rf ${tmpPath}`,
                    clean: 'npm run clean:tmp',
                    'mkdir:tmp': `mkdir -p ${tmpPath}`,
                    mkdir: 'npm run mkdir:tmp',
                };

                const scriptsServerPrepare = [];
                const scriptsWatch = [];
                const scriptsBuild = [
                    'npm run build:files',
                ];
                const scriptsBuildFiles = [
                    'npm run clean && npm run mkdir',
                ];

                if (_.get(this.options, 'clean-dest')) {
                    scripts['mkdir:dist'] = `mkdir -p ${destPath}`;
                    scripts['clean:dist'] = `rm -rf ${destPath}`;
                    scripts.mkdir += ' && npm run mkdir:dist';
                    scripts.clean += ' && npm run clean:dist';
                }

                if (_.get(this.options, 'browsersync')) {
                    scriptsServerPrepare.push('npm run clean:tmp');
                    scriptsServerPrepare.push('npm run mkdir:tmp');
                } else if (_.get(this.options, 'watch')) {
                    scriptsWatch.push('npm run clean:tmp');
                    scriptsWatch.push('npm run mkdir:tmp');
                }

                if (_.get(this.options, 'copy')) {
                    const copyPath = _.get(this.options, 'copy-path', []);
                    const copyPaths = _.isArray(copyPath) ? copyPath : [copyPath];
                    const copyScripts = copyPaths.map(pathToCopy => (
                        `cp -v ${pathToCopy} dist/ 2>/dev/null || :`
                    ));
                    scripts['copy:dist'] = copyScripts.join(' && ');
                    scripts.copy = 'npm run copy:dist';
                    scriptsBuildFiles.push('npm run copy');
                }

                if (_.get(this.options, 'browsersync')) {
                    const browserSyncPath = path.join(buildPath, 'browsersync.js');
                    scripts.browsersync = `node -r babel-register ${browserSyncPath}`;
                    scripts['server:prepare'] = 'echo "Preparing server..."';
                    if (_.get(this.options, 'watch')) {
                        scripts.server = 'npm run server:prepare && concurrently "npm run watch" "npm run browsersync"';
                    } else {
                        scripts.server = 'npm run server:prepare && npm run browsersync';
                    }
                    scripts.start = 'npm run server';
                }

                if (_.get(this.options, 'modernizr')) {
                    const modernizrPath = path.join(buildPath, 'modernizr.js');
                    scripts['modernizr:dist'] = `node -r babel-register ${modernizrPath} --dist`;
                    scripts['modernizr:server'] = `node -r babel-register ${modernizrPath}`;
                    scripts.modernizr = 'npm run modernizr:dist';
                    scripts['build:modernizr'] = 'npm run modernizr:dist';
                    if (_.get(this.options, 'browsersync')) {
                        scriptsServerPrepare.push('npm run modernizr:server');
                    } else if (_.get(this.options, 'watch')) {
                        scriptsWatch.push('npm run sass:dist');
                    }
                    scriptsBuild.push('npm run build:modernizr');
                }

                if (_.get(this.options, 'scss')) {
                    const postcssConfigFile = path.join(buildPath, 'postcss.config.js');
                    const scssPath = _.get(this.options, 'scss-path', 'scss');
                    const cssPath = _.get(this.options, 'css-path', 'css');
                    const scssSrcPath = _.get(this.options, 'scss-src-path', null) || path.join(srcPath, scssPath);
                    const scssTmpPath = _.get(this.options, 'scss-tmp-path', null) || path.join(tmpPath, cssPath);
                    const scssDestPath = _.get(this.options, 'scss-dest-path', null) || path.join(destPath, cssPath);

                    scripts['postcss:dist'] = `postcss -c ${postcssConfigFile} -d ${scssDestPath} ${path.join(scssTmpPath, '/**/*.css')}`;
                    scripts.postcss = 'npm run postcss:dist';
                    scripts['sass:dist'] = `node-sass --source-map .tmp/css --include-path ./node_modules -r ${scssSrcPath} --output ${scssTmpPath}`;
                    scripts['sass:watch'] = `node-sass --source-map .tmp/css --include-path ./node_modules -r --watch ${scssSrcPath} --output ${scssTmpPath}`;
                    scripts['styles:dist'] = 'npm run sass:dist && npm run postcss:dist';
                    scripts['styles:watch'] = 'npm run sass:watch';
                    scripts.styles = 'npm run styles:dist';
                    scripts['watch:styles'] = 'npm run styles:watch';
                    scripts['build:styles'] = 'npm run styles';

                    if (_.get(this.options, 'browsersync')) {
                        scriptsServerPrepare.push('npm run sass:dist');
                    } else if (_.get(this.options, 'watch')) {
                        scriptsWatch.push('npm run sass:dist');
                    }
                    if (_.get(this.options, 'watch')) {
                        scriptsWatch.push('npm run watch:styles');
                    }

                    scriptsBuild.push('npm run build:styles');
                }

                if (_.get(this.options, 'js')) {
                    const webpackConfigFile = path.join(buildPath, 'webpack.config.js');
                    const jsPath = _.get(this.options, 'js-path', 'js');
                    const jsSrcPath = _.get(this.options, 'js-src-path', null) || path.join(srcPath, jsPath);
                    scripts['lint:dist'] = `eslint ${path.join(jsSrcPath, '/**.js')}`;
                    scripts.lint = 'npm run lint:dist';
                    scripts.jscs = `jscs ${path.join(jsSrcPath, '/**.js')}`;
                    scripts['webpack:dist'] = `node -r babel-register ./node_modules/.bin/webpack --env=dist  --config ${webpackConfigFile} --progress --colors`;
                    scripts.webpack = 'npm run webpack:dist';
                    scripts['scripts:dist'] = 'npm run webpack:dist';
                    scripts.scripts = 'npm run scripts:dist';
                    scripts['build:js'] = 'npm run lint && npm run scripts';
                    scriptsBuild.push('npm run build:js');
                }

                if (_.get(this.options, 'images')) {
                    scripts['imagemin:dist'] = 'node -r babel-register ./build/imagemin.js';
                    scripts.imagemin = 'npm run imagemin:dist';
                    scripts['build:images'] = 'npm run imagemin:dist';
                    scriptsBuild.push('npm run build:images');
                }

                scriptsBuild.push('npm run clean:tmp');

                if (scriptsServerPrepare.length) {
                    scripts['server:prepare'] = scriptsServerPrepare.join(' && ');
                }

                if (scriptsWatch.length) {
                    scripts.watch = scriptsWatch.join(' && ');
                }

                if (scriptsBuild.length) {
                    scripts.build = scriptsBuild.join(' && ');
                }

                if (scriptsBuildFiles.length) {
                    scripts['build:files'] = scriptsBuildFiles.join(' && ');
                }

                const packagePath = this.destinationPath('package.json');
                this.fs.extendJSON(packagePath, {
                    scripts,
                });
            },
        };
    }

    get install() {
        return {
            npm() {
                if (this.options['skip-install']) {
                    return;
                }

                this.npmInstall([
                    'autoprefixer@latest',
                    'babel-loader@latest',
                    'babel-register@latest',
                    'brfs@latest',
                    'browser-sync@latest',
                    'bs-fullscreen-message@latest',
                    'concurrently@latest',
                    'commander@latest',
                    'css-loader@latest',
                    'cssnano@latest',
                    'customizr@latest',
                    'expose-loader@latest',
                    'extract-text-webpack-plugin@latest',
                    'html-loader@latest',
                    'imagemin-cli@latest',
                    'imagemin-mozjpeg@latest',
                    'imagemin-pngquant@latest',
                    'imagemin-svgo@latest',
                    'imports-loader@latest',
                    'json-loader@latest',
                    'node-sass@latest',
                    'postcss-cli@latest',
                    'postcss-loader@latest',
                    'pretty-bytes@latest',
                    'proxy-middleware@latest',
                    'raw-loader@latest',
                    'transform-loader@latest',
                    'sass-loader@latest',
                    'serve-static@latest',
                    'strip-ansi@latest',
                    'style-loader@latest',
                    'file-loader@latest',
                    'url-loader@latest',
                    'svg-react-loader@latest',
                    'webpack@latest',
                    'webpack-dev-middleware@latest',
                    'webpack-merge@latest',
                ], {
                    saveDev: true,
                });

                if (this.options['webpack-html']) {
                    this.npmInstall([
                        'autoprefixer@latest',
                    ], {
                        saveDev: true,
                    });
                }

                if (this.options['hot-reload']) {
                    this.npmInstall([
                        'webpack-hot-middleware@latest',
                        'react-hot-loader@^4.0.0-beta.21',
                    ], {
                        saveDev: true,
                    });
                }
            },

            sass() {
                if (this.options['skip-install']) {
                    return;
                }

                this.spawnCommand('gem', ['install', 'sass']);
            },
        };
    }
};
