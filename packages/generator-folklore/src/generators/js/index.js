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

        this.option('root-props-import', {
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
                    getRelativeStylesPath: (from, src) => path.relative(
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
                const rootPropsImport = this.options['root-props-import'] || null;
                this.fs.copyTpl(
                    this.templatePath('index.js'),
                    this.destinationPath(path.join(jsPath, 'index.js')),
                    { rootPropsImport },
                );
            },

            styles() {
                const templateData = {};

                const stylesPath = this.options['styles-path'] || path.join(this.options.path, 'styles');
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

            browserslistrc() {
                const srcPath = this.templatePath('browserslistrc');
                const destPath = this.destinationPath('.browserslistrc');
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
            'keymirror@latest',
            'lodash@latest',
            'react@latest',
            'prop-types@latest',
            'react-dom@latest',
            'react-redux@latest',
            'react-intl@latest',
            'react-router@^5.0.1',
            'react-router-dom@latest',
            'connected-react-router@latest',
            'react-helmet@latest',
            'node-polyglot@latest',
            'classnames@latest',
            '@folklore/react-container@latest',
            '@folklore/fonts@latest',
            '@folklore/forms@latest',
            '@folklore/tracking@latest',
            'react-loadable@latest',
            'webfontloader@latest',
            'intl@latest',
        ];

        const devDependencies = ['html-webpack-plugin@latest'];

        this.addDependencies(dependencies);
        this.addDevDependencies(devDependencies);
    }
};
