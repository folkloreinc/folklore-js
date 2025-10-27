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

        this.option('types-path', {
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

            types() {
                const typesPath =
                    this.options['types-path'] || path.join(this.options.path, 'types');
                console.log('yo', typesPath, this.templatePath('types'));
                const srcPath = this.templatePath('types');
                const destPath = this.destinationPath(typesPath);
                this.fs.copy(srcPath, destPath);
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
                this.addDependencies({
                    react: '^18.3.1',
                    'react-dom': '^18.3.1',
                    'react-intl': '^7.1.1',
                    wouter: '^3.7.1',
                    'react-helmet': '^6.1.0',
                    classnames: '^2.5.1',

                    '@folklore/routes': '^0.2.43',
                    '@folklore/fonts': '^0.0.16',
                    '@folklore/forms': '^0.0.29',
                    '@folklore/fetch': '^0.1.21',
                    '@folklore/hooks': '^0.0.75',
                    '@folklore/tracking': '^0.0.33',

                    // Polyfills
                    intl: '^1.2.5',
                    '@formatjs/intl-locale': '^4.2.11',
                    '@formatjs/intl-pluralrules': '^5.4.4',
                    'intersection-observer': '^0.12.2',
                    'resize-observer-polyfill': '^1.5.1',
                    'sanitize.css': '^13.0.0',
                });
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
