import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class NpmPackageGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('package-name', {
            type: String,
            required: false,
        });

        this.option('src', {
            type: Boolean,
            desc: 'Includes src path',
            defaults: true,
        });

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });

        this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: './.tmp',
        });

        this.option('dest-path', {
            type: String,
            desc: 'Path for build',
            defaults: './dist',
        });

        this.option('build-path', {
            type: String,
            desc: 'Path for build',
            defaults: './build',
        });

        this.option('hot-reload', {
            type: Boolean,
            desc: 'Add hot reloading',
            defaults: false,
        });

        this.option('browsersync-base-dir', {
            type: String,
            desc: 'BrowserSync base directories',
        });

        this.option('browsersync-files', {
            type: String,
            desc: 'BrowserSync files to watch',
        });

        this.option('webpack-html', {
            type: Boolean,
            desc: 'Add html to webpack',
            defaults: false,
        });

        this.option('webpack-dev-context', {
            type: String,
            desc: 'Specify dev context path',
        });

        this.option('webpack-dev-entries', {
            type: Object,
            desc: 'Specify dev entries',
        });

        this.option('webpack-dist-entries', {
            type: Object,
            desc: 'Specify dist entries',
        });

        this.option('webpack-config-base', {
            type: Boolean,
            desc: 'Add a base webpack config file',
            defaults: true,
        });

        this.option('webpack-config-dev', {
            type: Boolean,
            desc: 'Add a dev webpack config file',
            defaults: true,
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('NPM Package Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['package-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'package-name',
                        message: 'Name of the package:',
                        default: () => {
                            const parts = process.cwd().split(path.sep);
                            return parts[parts.length - 1];
                        },
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers['package-name']) {
                            this.options['package-name'] = answers['package-name'];
                        }
                    });
            },
        };
    }

    configuring() {
        const srcPath = _.get(this.options, 'src-path');
        const destPath = _.get(this.options, 'dest-path');
        const tmpPath = _.get(this.options, 'tmp-path');
        const buildPath = _.get(this.options, 'build-path');
        const skipInstall = _.get(this.options, 'skip-install', false);
        const hotReload = _.get(this.options, 'hot-reload', false);
        const webpackConfigBase = _.get(this.options, 'webpack-config-base', false);
        const webpackConfigDev = _.get(this.options, 'webpack-config-dev', false);
        const webpackHtml = _.get(this.options, 'webpack-html', false);
        const webpackDevContext = _.get(this.options, 'webpack-dev-context', null);
        const webpackDevEntries = _.get(this.options, 'webpack-dev-entries', null);
        const webpackDistEntries = _.get(this.options, 'webpack-dist-entries', null);
        const webpackEntries = webpackDevEntries !== null && webpackDistEntries !== null ? null : {
            [this.options['package-name']]: './index',
        };
        const browserSyncBaseDir = _.get(this.options, 'browsersync-base-dir') || [
            tmpPath,
            srcPath,
        ];
        const browserSyncFiles = _.get(this.options, 'browsersync-files') || [
            path.join(srcPath, '*.html'),
        ];

        this.composeWith('folklore:build', {
            'project-name': this.options['package-name'],
            path: buildPath,
            'tmp-path': tmpPath,
            'src-path': srcPath,
            'dest-path': destPath,
            'js-path': './',
            scss: false,
            images: false,
            copy: false,
            watch: false,
            'clean-dest': true,
            modernizr: false,
            'webpack-config-base': webpackConfigBase,
            'webpack-config-dev': webpackConfigDev,
            'webpack-html': webpackHtml,
            'hot-reload': hotReload,
            'webpack-dev-context': webpackDevContext,
            'webpack-entries': webpackEntries,
            'webpack-dist-entries': webpackDistEntries,
            'webpack-dev-entries': webpackDevEntries,
            'browsersync-base-dir': browserSyncBaseDir,
            'browsersync-files': browserSyncFiles,
            'skip-install': skipInstall,
            quiet: true,
        });

        this.composeWith('folklore:babel', {
            'skip-install': skipInstall,
            'hot-reload': hotReload,
            compile: true,
            'transform-runtime': true,
            quiet: true,
        });

        this.composeWith('folklore:eslint', {
            'skip-install': skipInstall,
            quiet: true,
        });

        this.composeWith('folklore:editorconfig', {
            quiet: true,
        });
    }

    get writing() {
        return {
            src() {
                if (!this.options.src) {
                    return;
                }
                const srcPath = this.templatePath('src');
                const destPath = this.destinationPath('src');
                /* this.directory */this.fs.copyTpl(srcPath, destPath, this);
            },

            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.destinationPath('.gitignore');
                this.fs.copy(srcPath, destPath);
            },

            readme() {
                const srcPath = this.templatePath('Readme.md');
                const destPath = this.destinationPath('Readme.md');
                this.fs.copy(srcPath, destPath);
            },

            packageJSON() {
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath('package.json');
                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.name = this.options['package-name'];
                const currentPackageJSON = this.fs.exists(destPath) ?
                    this.fs.readJSON(destPath) : {};
                this.fs.writeJSON(destPath, _.merge(packageJSON, currentPackageJSON));
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
                    'babel-runtime@latest',
                ], {
                    save: true,
                });

                this.npmInstall([
                    'jest@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
