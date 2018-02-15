import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import { pascal } from 'change-case';
import Generator from '../../lib/generator';

module.exports = class ReactPackageGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('package-name', {
            type: String,
            required: false,
        });

        this.argument('component-name', {
            type: String,
            required: false,
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

        this.option('examples-path', {
            type: String,
            desc: 'Path for examples',
            defaults: './examples',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('React Package Generator');
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

                if (!this.options['component-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'component-name',
                        message: 'Name of the component:',
                        default: (answers) => {
                            const packageName = (this.options['package-name'] || answers['package-name']);
                            return packageName ? pascal(packageName) : undefined;
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
                        if (answers['component-name']) {
                            this.options['component-name'] = answers['component-name'];
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
        const examplesPath = _.get(this.options, 'examples-path');
        const skipInstall = _.get(this.options, 'skip-install', false);

        this.composeWith('folklore:npm-package', {
            'package-name': this.options['package-name'],
            src: false,
            'src-path': srcPath,
            'dest-path': destPath,
            'tmp-path': tmpPath,
            'build-path': buildPath,
            'skip-install': skipInstall,
            'hot-reload': true,
            'webpack-html': true,
            'webpack-dev-context': 'examples',
            'webpack-dist-entries': {
                [this.options['package-name']]: './index',
            },
            'webpack-dev-entries': {
                main: './js/index',
            },
            'browsersync-base-dir': [
                tmpPath,
                examplesPath,
            ],
            'browsersync-files': [
                path.join(examplesPath, '**'),
            ],
            quiet: true,
        });
    }

    get writing() {
        return {
            examples() {
                const srcPath = this.templatePath('examples');
                const destPath = this.destinationPath('examples');
                this.fs.copyTpl(srcPath, destPath, this);
            },

            src() {
                const srcPath = this.templatePath('src');
                const destPath = this.destinationPath('src');
                this.fs.copyTpl(srcPath, destPath, {
                    componentName: this.options['component-name'],
                });
            },

            storybook() {
                const srcPath = this.templatePath('storybook');
                const destPath = this.destinationPath('.storybook');
                this.fs.copyTpl(srcPath, destPath, {});
            },

            packageJSON() {
                const packagePath = this.destinationPath('package.json');
                this.fs.extendJSON(packagePath, {
                    scripts: {
                        storybook: 'start-storybook -p 9001 -c .storybook',
                    },
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
                    'react@latest',
                    'prop-types@latest',
                    'react-dom@latest',
                ], {
                    save: true,
                });

                this.npmInstall([
                    'domready@latest',
                    'jquery@latest',
                    'enzyme@latest',
                    'react-test-renderer@latest',
                    '@storybook/react@latest',
                    '@storybook/addon-actions@latest',
                    'extract-text-webpack-plugin@latest',
                    'html-webpack-plugin@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
