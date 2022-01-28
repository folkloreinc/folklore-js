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

        this.option('watch-path', {
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

        this.buildPath = (filePath) => this.destinationPath(path.join(this.options.path, filePath));
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
            // config() {
            //     const templateData = {
            //         hasHtml: (this.options['html-path'] || null) !== null,
            //         hasServer: this.options.server || false,
            //         hasServerProxy: this.options['server-proxy'] || false,
            //         serverProxyHost: this.options['server-proxy-host'] || null,
            //         serverBrowserHost: this.options['server-browser-host'] || null,
            //         hasImagemin: this.options.imagemin,
            //         imageminFiles:
            //             (this.options['imagemin-files'] || null) !== null
            //             && !isArray(this.options['imagemin-files'])
            //                 ? [this.options['imagemin-files']]
            //                 : this.options['imagemin-files'],
            //         imageminOutputPath: this.options['imagemin-output-path'] || null,
            //     };

            //     const srcPath = this.templatePath('config.js');
            //     const destPath = this.buildPath('config.js');
            //     this.fs.copyTpl(srcPath, destPath, templateData);
            // },

            packageJSON() {
                const prodWebpackPath = path.join(this.options.path, 'webpack.config.prod.js');
                const scripts = {
                    build: `node ./build/scripts/build.js --config ${prodWebpackPath}`,
                };
                if (this.options.server) {
                    const devWebpackPath = path.join(this.options.path, 'webpack.config.dev.js');
                    scripts.server = `node ./build/scripts/server.js --config ${devWebpackPath}`;
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
                    'html-webpack-plugin@^4.0.0-alpha.2',
                    'webpack-manifest-plugin@latest',
                    'case-sensitive-paths-webpack-plugin@latest',
                    'postcss-preset-env@latest',
                    'postcss-safe-parser@latest',
                    'postcss-flexbugs-fixes@latest',
                    'pnp-webpack-plugin@latest',
                    'babel-preset-react-app@^6.1.0',
                    'babel-plugin-named-asset-import@latest',
                    'terser-webpack-plugin@latest',
                    'mini-css-extract-plugin@latest',
                    'optimize-css-assets-webpack-plugin@latest',
                    'workbox-webpack-plugin@latest',

                    // Others
                    'autoprefixer@latest',
                    'cssnano@latest',
                    'chalk@latest',
                    'dotenv@latest',
                    'dotenv-expand@latest',
                    'node-sass@latest',
                    'fs-extra@latest',
                    'glob@latest',
                    'pretty-bytes@latest',
                    'react-dev-utils@^10.0.0',
                    'webpack@^4.0', // TODO: update webpack 4
                ];

                const dependencies = [
                    'whatwg-fetch',
                    'core-js@^2.4.0',
                    'promise',
                    'raf',
                    'lodash@latest',
                    'object-assign',
                ];

                if (this.options.server) {
                    devDependencies.push('webpack-dev-server@^3.1');
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
