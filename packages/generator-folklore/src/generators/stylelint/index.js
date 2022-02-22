import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class StylelintGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('camel-case', {
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
                console.log('Stylelint Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            eslintrc() {
                const srcPath = this.templatePath('stylelintrc');
                const destPath = this.destinationPath('.stylelintrc');
                this.fs.copyTpl(srcPath, destPath, {
                    camelCase: this.options['camel-case'],
                });
            },
        };
    }

    install() {
        if (this.options['skip-install']) {
            return;
        }

        this.npmInstall(
            [
                'stylelint',
                'stylelint-config-property-sort-order-smacss',
                'stylelint-config-recommended',
                'stylelint-config-prettier',
                'stylelint-config-sass-guidelines',
            ],
            {
                'save-dev': true,
            },
        );
    }
};
