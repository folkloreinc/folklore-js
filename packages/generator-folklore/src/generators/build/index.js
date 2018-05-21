import path from 'path';
import chalk from 'chalk';
import isArray from 'lodash/isArray';
import Generator from '../../lib/generator';

module.exports = class AppGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.option('path', {
            type: String,
            defaults: './build/',
        });

        this.option('src-path', {
            type: String,
            defaults: './src/',
        });

        this.option('build-path', {
            type: String,
            defaults: './dist/',
        });

        this.option('public-path', {
            type: String,
        });

        this.option('empty-path', {
            type: String,
        });

        this.option('entry-path', {
            type: String,
            defaults: './src/index.js',
        });

        this.option('html-path', {
            type: String,
        });

        this.option('server', {
            type: Boolean,
            defaults: true,
        });

        this.option('server-watch-path', {
            type: String,
        });

        this.option('server-proxy', {
            type: Boolean,
            defaults: false,
        });

        this.option('server-proxy-host', {
            type: String,
        });

        this.option('server-browser-host', {
            type: String,
        });

        this.option('modernizr', {
            type: Boolean,
            defaults: false,
        });

        this.option('modernizr-output-path', {
            type: String,
            defaults: './dist/modernizr.js',
        });

        this.option('imagemin', {
            type: Boolean,
            defaults: false,
        });

        this.option('imagemin-files', {
            type: String,
            defaults: './src/img/**/*.{jpg,png,jpeg,gif,svg}',
        });

        this.option('imagemin-output-path', {
            type: String,
            defaults: './dist/img/',
        });

        this.option('copy', {
            type: Boolean,
            defaults: false,
        });

        this.option('copy-path', {
            type: String,
        });

        this.buildPath = filePath => this.destinationPath(path.join(this.options.path, filePath));
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
        };
    }

    get writing() {
        return {
            config() {
                const templateData = {
                    hasServer: this.options.server || false,
                    hasServerProxy: this.options['server-proxy'] || false,
                    serverProxyHost: this.options['server-proxy-host'] || null,
                    serverBrowserHost: this.options['server-browser-host'] || null,
                    hasImagemin: this.options.imagemin,
                    imageminFiles:
                        (this.options['imagemin-files'] || null) !== null &&
                        !isArray(this.options['imagemin-files'])
                            ? [this.options['imagemin-files']]
                            : this.options['imagemin-files'],
                    imageminOutputPath: this.options['imagemin-output-path'] || null,
                };

                const srcPath = this.templatePath('config.js');
                const destPath = this.buildPath('config.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            env() {
                const srcPath = this.templatePath('env.js');
                const destPath = this.buildPath('env.js');
                this.fs.copy(srcPath, destPath);
            },

            polyfills() {
                const srcPath = this.templatePath('polyfills.js');
                const destPath = this.buildPath('polyfills.js');
                this.fs.copy(srcPath, destPath);
            },

            paths() {
                const templateData = {
                    entryPath: this.options['entry-path'] || null,
                    buildPath: this.options['build-path'] || null,
                    publicPath: this.options['public-path'] || this.options['build-path'] || null,
                    srcPath: this.options['src-path'] || null,
                    htmlPath: this.options['html-path'] || null,
                    watchPaths:
                        (this.options['server-watch-path'] || null) !== null &&
                        !isArray(this.options['server-watch-path'])
                            ? [...this.options['server-watch-path'].split(',')]
                            : this.options['server-watch-path'],
                    emptyPaths:
                        (this.options['empty-path'] || null) !== null &&
                        !isArray(this.options['empty-path'])
                            ? [...this.options['empty-path'].split(',')]
                            : this.options['empty-path'],
                    copyPaths:
                        (this.options['copy-path'] || null) !== null &&
                        !isArray(this.options['copy-path'])
                            ? [...this.options['copy-path'].split(',')]
                            : this.options['copy-path'],
                };

                const srcPath = this.templatePath('paths.js');
                const destPath = this.buildPath('paths.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            utils() {
                const srcPath = this.templatePath('utils');
                const destPath = this.buildPath('utils');
                this.fs.copy(srcPath, destPath);
            },

            webpack() {
                const templateData = {};

                const devSrcPath = this.templatePath('webpack.config.dev.js');
                const devDestPath = this.buildPath('webpack.config.dev.js');
                this.fs.copyTpl(devSrcPath, devDestPath, templateData);

                const prodSrcPath = this.templatePath('webpack.config.prod.js');
                const prodDestPath = this.buildPath('webpack.config.prod.js');
                this.fs.copyTpl(prodSrcPath, prodDestPath, templateData);
            },

            webpackDevServer() {
                if (!this.options.server) {
                    return;
                }
                const templateData = {};

                const srcPath = this.templatePath('webpackDevServer.config.js');
                const destPath = this.buildPath('webpackDevServer.config.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            postcssConfig() {
                const templateData = {};

                const srcPath = this.templatePath('postcss.config.js');
                const destPath = this.buildPath('postcss.config.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            imagemin() {
                if (!this.options.imagemin) {
                    return;
                }

                const templateData = {};

                const srcPath = this.templatePath('scripts/imagemin.js');
                const destPath = this.buildPath('scripts/imagemin.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            modernizr() {
                if (!this.options.modernizr) {
                    return;
                }

                const templateData = {
                    outputPath: this.options['modernizr-output-path'] || null,
                };

                const srcPath = this.templatePath('scripts/modernizr.js');
                const destPath = this.buildPath('scripts/modernizr.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            build() {
                const templateData = {};

                const srcPath = this.templatePath('scripts/build.js');
                const destPath = this.buildPath('scripts/build.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            server() {
                if (!this.options.server) {
                    return;
                }
                const templateData = {};

                const srcPath = this.templatePath('scripts/server.js');
                const destPath = this.buildPath('scripts/server.js');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            packageJSON() {
                const scripts = {
                    build: 'node ./build/scripts/build.js',
                };
                if (this.options.server) {
                    scripts.server = 'node ./build/scripts/server.js';
                    scripts.start = 'npm run server';
                }

                const destPath = this.destinationPath('package.json');
                const currentData = this.fs.exists(destPath) ? this.fs.readJSON(destPath) : {};
                const newData = {
                    ...currentData,
                    scripts: {
                        ...(currentData.scripts || null),
                        ...scripts,
                    },
                };
                this.fs.writeJSON(destPath, newData);
            },
        };
    }

    get install() {
        return {
            npm() {
                if (this.options['skip-install']) {
                    return;
                }

                const devDependencies = [
                    // Loaders
                    'babel-loader@latest',
                    'css-loader@latest',
                    'eslint-loader@latest',
                    'file-loader@latest',
                    'postcss-loader@latest',
                    'sass-loader@latest',
                    'style-loader@latest',
                    'url-loader@latest',

                    // Plugins
                    'extract-text-webpack-plugin@latest',
                    'html-webpack-plugin@latest',
                    'sw-precache-webpack-plugin@latest',
                    'webpack-manifest-plugin@latest',
                    'case-sensitive-paths-webpack-plugin@latest',

                    // Others
                    'autoprefixer@latest',
                    'chalk@latest',
                    'dotenv@latest',
                    'dotenv-expand@latest',
                    'fs-extra@latest',
                    'glob@latest',
                    'lodash@latest',
                    'node-sass@latest',
                    'pretty-bytes@latest',
                    'react-dev-utils@^5.0.1',
                    'webpack@^3.0', // TODO: update webpack 4
                ];

                const dependencies = ['whatwg-fetch', 'core-js', 'promise', 'raf', 'object-assign'];

                if (this.options.server) {
                    devDependencies.push('webpack-dev-server@^2.0');
                }

                if (this.options.imagemin) {
                    devDependencies.push('imagemin@latest');
                    devDependencies.push('imagemin-mozjpeg@latest');
                    devDependencies.push('imagemin-svgo@latest');
                    devDependencies.push('imagemin-pngquant@latest');
                }

                this.npmInstall(dependencies, {
                    save: true,
                });

                this.npmInstall(devDependencies, {
                    'save-dev': true,
                });
            },
        };
    }
};
