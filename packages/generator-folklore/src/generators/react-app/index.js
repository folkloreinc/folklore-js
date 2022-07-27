import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class ReactAppGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('path', {
            type: String,
            defaults: 'src',
        });

        this.option('styles-path', {
            type: String,
        });
    }

    initializing() {
        this.react_features = [];
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('React App Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts).then((answers) => {
                    if (answers['project-name']) {
                        this.options['project-name'] = answers['project-name'];
                    }
                });
            },
        };
    }

    get writing() {
        return {
            directory() {
                const jsPath = this.options.path;
                const stylesPath = this.options['styles-path'] || null;

                const templateData = {
                    getRelativeStylesPath: (from, src) =>
                        path.relative(
                            this.destinationPath(path.dirname(path.join(jsPath, from))),
                            this.destinationPath(
                                path.join(stylesPath || path.join(jsPath, 'styles'), src),
                            ),
                        ),
                };

                const destPath = this.destinationPath(jsPath);
                const srcPath = this.templatePath('src');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            index() {
                const jsPath = this.options.path;
                this.fs.copyTpl(
                    this.templatePath('index.js'),
                    this.destinationPath(path.join(jsPath, 'index.js')),
                );
            },

            styles() {
                const templateData = {};

                const stylesPath =
                    this.options['styles-path'] || path.join(this.options.path, 'styles');
                const srcPath = this.templatePath('styles');
                const destPath = this.destinationPath(stylesPath);
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            packageJSON() {
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath('package.json');

                const packageJSON = this.fs.readJSON(srcPath);
                this.packageJson.merge({
                    ...packageJSON,
                    name: this.options['project-name'],
                });
            },

            dependencies() {
                this.addDependencies([
                    'react',
                    'react-dom',
                    'prop-types',
                    'react-intl',
                    'react-router',
                    'react-router-dom',
                    'react-helmet',
                    'classnames',

                    '@folklore/routes',
                    '@folklore/fonts',
                    '@folklore/forms',
                    '@folklore/fetch',
                    '@folklore/hooks',
                    '@folklore/tracking',

                    // Polyfills
                    'intl',
                    '@formatjs/intl-locale',
                    '@formatjs/intl-pluralrules',
                    'intersection-observer',
                    'resize-observer-polyfill',
                ]);
            },
        };
    }

    async install() {
        if (this.options['skip-install']) {
            return;
        }

        await this.spawnCommand('npm', ['install']);
    }
};
