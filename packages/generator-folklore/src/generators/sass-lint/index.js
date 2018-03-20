import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class SassLintGenerator extends Generator {
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
                console.log('Sass lint Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            eslintrc() {
                const srcPath = this.templatePath('sass-lint.yml');
                const destPath = this.destinationPath('.sass-lint.yml');
                this.fs.copyTpl(srcPath, destPath, {
                    camelCase: this.options['camel-case'],
                });
            },
        };
    }
};
