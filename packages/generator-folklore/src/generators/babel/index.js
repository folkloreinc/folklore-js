import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class BabelGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('build-path', {
            type: String,
            required: false,
            defaults: './build',
        });

        this.option('react-app', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.option('transform-runtime', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.option('compile', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.option('react-intl', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.buildPath = filePath => this.destinationPath(path.join(this.options['build-path'], filePath));
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Babel Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            babelrc() {
                const presetPath = this.destinationPath(path.join(
                    this.options['build-path'],
                    'babel-preset.js',
                ));
                const projectPath = this.destinationPath();
                const srcPath = this.templatePath('babelrc');
                const destPath = this.destinationPath('.babelrc');
                this.fs.copyTpl(srcPath, destPath, {
                    presetPath: `./${path.relative(projectPath, presetPath)}`,
                });
            },

            preset() {
                const srcPath = this.templatePath(this.options['react-app'] ? 'babel-preset-react.js' : 'babel-preset.js');
                const destPath = this.buildPath('babel-preset.js');
                this.fs.copyTpl(srcPath, destPath, {
                    hasTransformRuntime: this.options['transform-runtime'],
                    hasReactIntl: this.options['react-intl'],
                    hasCompile: this.options.compile,
                });
            },

            utils() {
                if (!this.options.compile) {
                    return;
                }
                const srcPath = this.templatePath('utils');
                const destPath = this.buildPath('utils');
                this.fs.copyTpl(srcPath, destPath, {

                });
            },

            getLocalIdent() {
                if (!this.options.compile) {
                    return;
                }
                const destPath = this.buildPath('utils/getLocalIdent.js');
                if (this.fs.exists(destPath)) {
                    return;
                }
                const srcPath = path.join(
                    this.templatePath(),
                    '../../build/templates/utils/getLocalIdent.js',
                );
                this.fs.copy(srcPath, destPath);
            },
        };
    }

    get install() {
        return {
            npm() {
                if (this.options['skip-install']) {
                    return;
                }

                const dependencies = [];

                const devDependencies = this.options['react-app'] ? [
                    '@babel/cli@latest',
                    '@babel/core@latest',
                    '@babel/polyfill@latest',
                    '@babel/register@latest',
                    'babel-preset-react-app@latest',
                ] : [
                    '@babel/cli@latest',
                    '@babel/core@latest',
                    '@babel/polyfill@latest',
                    '@babel/register@latest',
                    'babel-plugin-dynamic-import-node@latest',
                    '@babel/plugin-syntax-dynamic-import@latest',
                    '@babel/plugin-proposal-object-rest-spread@latest',
                    'babel-plugin-css-modules-transform@latest',
                    '@babel/preset-env@latest',
                    '@babel/preset-react@latest',
                ];

                if (this.options['transform-runtime']) {
                    dependencies.push('@babel/runtime@latest');
                    devDependencies.push('@babel/plugin-transform-runtime@latest');
                }

                if (this.options['react-intl']) {
                    devDependencies.push('babel-plugin-react-intl@latest');
                }

                if (this.options.compile) {
                    devDependencies.push('node-sass@latest');
                }

                if (dependencies.length > 0) {
                    this.npmInstall(dependencies, {
                        save: true,
                    });
                }

                if (devDependencies.length > 0) {
                    this.npmInstall(devDependencies, {
                        'save-dev': true,
                    });
                }
            },
        };
    }
};
