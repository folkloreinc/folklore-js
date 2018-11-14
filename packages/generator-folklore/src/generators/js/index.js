import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class JsGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('babel-compile', {
            type: Boolean,
            defaults: false,
        });

        this.option('path', {
            type: String,
            defaults: 'src/js',
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
                console.log('Javascript Generator');
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

    configuring() {
        const skipInstall = this.options['skip-install'];
        this.composeWith('folklore:babel', {
            'react-app': !this.options['babel-compile'],
            compile: this.options['babel-compile'],
            'skip-install': skipInstall,
            quiet: true,
        });

        this.composeWith('folklore:eslint', {
            'skip-install': skipInstall,
            quiet: true,
        });
    }

    get writing() {
        return {
            directory() {
                const jsPath = this.options.path;
                const stylesPath = this.options['styles-path'] || null;

                const templateData = {
                    getRelativeStylesPath: (from, src) => (
                        path.relative(
                            this.destinationPath(path.dirname(path.join(jsPath, from))),
                            this.destinationPath(path.join(stylesPath || path.join(jsPath, 'styles'), src)),
                        )
                    ),
                };

                const destPath = this.destinationPath(jsPath);
                const srcPath = this.templatePath('src');
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            styles() {
                const templateData = {};

                const stylesPath =
                    this.options['styles-path'] || path.join(this.options.path, 'styles');
                const srcPath = this.templatePath('styles');
                const destPath = this.destinationPath(stylesPath);
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            config() {
                const jsPath = _.get(this.options, 'path');
                const srcPath = this.templatePath('config.js');
                const destPath = this.destinationPath(path.join(jsPath, 'config.js'));
                this.fs.copy(srcPath, destPath);
            },

            packageJSON() {
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath('package.json');

                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.name = this.options['project-name'];
                const currentPackageJSON = this.fs.exists(destPath)
                    ? this.fs.readJSON(destPath)
                    : {};
                this.fs.writeJSON(destPath, _.merge(packageJSON, currentPackageJSON));
            },
        };
    }

    install() {
        if (this.options['skip-install']) {
            return;
        }

        const dependencies = [
            'domready@latest',
            'fastclick@latest',
            'hypernova@latest',
            'keymirror@latest',
            'lodash@latest',
            'react@latest',
            'prop-types@latest',
            'react-dom@latest',
            'react-redux@latest',
            'react-intl@latest',
            'history@^4.7.0',
            'react-router@^4.2.0',
            'react-helmet@latest',
            'node-polyglot@latest',
            'classnames@latest',
            '@folklore/react-container@latest',
            'react-loadable@latest',
            'webfontloader@latest',
        ];

        const devDependencies = ['html-webpack-plugin@latest'];

        this.npmInstall(dependencies, {
            save: true,
        });

        this.npmInstall(devDependencies, {
            'save-dev': true,
        });
    }
};
