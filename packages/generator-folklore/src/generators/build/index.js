import path from 'path';
import chalk from 'chalk';
import isArray from 'lodash/isArray';
import Generator from '../../lib/generator';

module.exports = class AppGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.option('scripts-path', {
            type: String,
            defaults: './scripts/',
        });

        this.option('src-path', {
            type: String,
            defaults: './src/',
        });

        this.option('entry-path', {
            type: String,
            defaults: './src/index.js',
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

        this.option('html-path', {
            type: String,
        });

        this.option('server', {
            type: Boolean,
            defaults: true,
        });

        this.scriptsPath = (filePath) =>
            this.destinationPath(path.join(this.options.scriptsPath, filePath));
    }

    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('Build tools Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    get writing() {
        return {
            packageJSON() {
                const {
                    'entry-path': entryPath,
                    'src-path': srcPath,
                    'build-path': buildPath,
                    'public-path': publicPath,
                    'html-path': htmlPath,
                    server,
                } = this.options;
                const scripts = {
                    build: `flklr build --load-env ${entryPath}`,
                };
                if (server) {
                    scripts.server = `flklr serve --load-env ${entryPath}`;
                    scripts.start = 'npm run server';
                }

                this.packageJson.merge({
                    scripts,
                    build: {
                        outputPath: buildPath,
                        srcPath,
                        htmlPath,
                        publicPath,
                        disableImageOptimization: true,
                    },
                });
            },

            dependencies() {
                this.addDevDependencies(['@folklore/cli'])
            }
        }

    }

    async install() {
        if (this.options['skip-install']) {
            return;
        }

        await this.spawnCommand('npm', ['install']);
    }
};
