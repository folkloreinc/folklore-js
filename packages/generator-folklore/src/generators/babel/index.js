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

        this.option('transform-runtime', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.option('hot-reload', {
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
                const srcPath = this.templatePath('babel-preset.js');
                const destPath = this.destinationPath(path.join(this.options['build-path'], 'babel-preset.js'));
                this.fs.copyTpl(srcPath, destPath, {
                    hotReload: this.options['hot-reload'],
                    transformRuntime: this.options['transform-runtime'],
                    reactIntl: this.options['react-intl'],
                    compile: this.options.compile,
                });
            },

            lib() {
                const srcPath = this.templatePath('lib');
                const destPath = this.destinationPath(path.join(this.options['build-path'], 'lib'));
                this.fs.copyTpl(srcPath, destPath, {

                });
            },

            getLocalIdent() {
                const destPath = this.destinationPath(path.join(
                    this.options['build-path'],
                    'lib/getLocalIdent.js',
                ));
                if (this.fs.exists(destPath)) {
                    return;
                }
                const srcPath = path.join(
                    this.templatePath(),
                    '../../build/templates/lib/getLocalIdent.js',
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

                this.npmInstall([
                    'babel-cli@latest',
                    'babel-core@latest',
                    'babel-register@latest',
                    'babel-plugin-dynamic-import-node@latest',
                    'babel-plugin-syntax-dynamic-import@latest',
                    'babel-plugin-transform-es2015-spread@latest',
                    'babel-plugin-transform-object-rest-spread@latest',
                    'babel-plugin-transform-class-properties@latest',
                    'babel-plugin-css-modules-transform@latest',
                    'babel-preset-env@latest',
                    'babel-preset-react@latest',
                ], {
                    saveDev: true,
                });

                if (this.options['transform-runtime']) {
                    this.npmInstall([
                        'babel-plugin-transform-runtime@latest',
                    ], {
                        saveDev: true,
                    });
                    this.npmInstall([
                        'babel-runtime@latest',
                    ], {
                        save: true,
                    });
                }
            },
        };
    }
};
