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

        // this.option('server-proxy-host', {
        //     type: String,
        // });

        // this.option('server-browser-host', {
        //     type: String,
        // });

        this.option('imagemin', {
            type: Boolean,
            defaults: false,
        });

        this.option('intl', {
            type: Boolean,
            defaults: false,
        });

        // this.option('copy', {
        //     type: Boolean,
        //     defaults: false,
        // });

        // this.option('copy-path', {
        //     type: String,
        // });

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

            images() {
                if (this.options.imagemin) {
                    const srcPath = this.templatePath('scripts/images.sh');
                    const destPath = this.destinationPath('scripts/images.sh');
                    this.fs.copyTpl(srcPath, destPath);
                }
            },

            packageJSON() {
                const scripts = {
                    clean: 'rm -rf public/static && rm -rf public/precache-*',
                    'build:scripts': 'flklr build --load-env ./resources/assets/js/index.js',
                    build: 'npm run clean && npm run build:scripts && npm run build:images',
                    server: 'flklr serve --load-env ./resources/assets/js/index.js',
                    start: 'npm run server',
                    // intl: "flklr intl --po --ast --output-path ./resources/lang 'resources/assets/js/**/*.{js,jsx}'",
                };

                if (this.options.laravel) {
                    scripts['build:views'] = 'php artisan view:assets';
                    scripts.build = scripts.build + ' && npm run build:views';
                }

                if (this.options.imagemin) {
                    scripts['build:images'] = './scripts/images.sh';
                }

                if (this.options.intl) {
                    scripts.intl =
                        "flklr intl --po --ast --output-path ./resources/lang 'resources/assets/js/**/*.{js,jsx}'";
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

                const devDependencies = ['@folklore/cli@latest'];

                const dependencies = [
                    'whatwg-fetch',
                    'core-js@latest',
                    'lodash@latest',
                    'object-assign',
                    'raf',
                ];

                if (this.options.imagemin) {
                    devDependencies.push('imagemin-cli');
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
