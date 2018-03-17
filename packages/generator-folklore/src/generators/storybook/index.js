import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class StorybookGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('pattern', {
            type: String,
            required: false,
            defaults: '../src/__stories__/*.story.jsx',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Storybook Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            staticFiles() {
                this.fs.copy(this.templatePath('babelrc'), this.destinationPath('.babelrc'));
                this.fs.copy(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'));
                this.fs.copy(this.templatePath('addons.js'), this.destinationPath('addons.js'));
                this.fs.copy(this.templatePath('config.js'), this.destinationPath('config.js'));
                this.fs.copy(this.templatePath('imports.js'), this.destinationPath('imports.js'));
                this.fs.copy(this.templatePath('KeepValue.jsx'), this.destinationPath('KeepValue.jsx'));
                this.fs.copy(this.templatePath('preview-head.html'), this.destinationPath('preview-head.html'));
                this.fs.copy(this.templatePath('storiesOf.jsx'), this.destinationPath('storiesOf.jsx'));
            },

            storiesPattern() {
                this.fs.copyTpl(this.templatePath('stories.pattern'), this.destinationPath('stories.pattern'), {
                    pattern: this.options.pattern,
                });
            },

            packageJSON() {
                const destPath = this.destinationPath('package.json');
                if (!this.fs.exists()) {
                    return;
                }
                const packageJSON = this.fs.exists(destPath) ?
                    this.fs.readJSON(destPath) : {};
                packageJSON['storybook-deployer'] = {
                    gitUsername: 'Folklore',
                    gitEmail: 'info@atelierfolklore.ca',
                    commitMessage: 'Deploy Storybook to GitHub Pages',
                };
                this.fs.writeJSON(destPath, packageJSON);
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
                    '@storybook/addon-actions@latest',
                    '@storybook/addon-info@latest',
                    '@storybook/addon-storyshots@latest',
                    '@storybook/addons@latest',
                    '@storybook/react@latest',
                    '@storybook/storybook-deployer@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
