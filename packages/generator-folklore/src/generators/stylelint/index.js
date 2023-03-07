import chalk from 'chalk';

import Generator from '../../lib/generator';

module.exports = class StylelintGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('camel-case', {
            type: Boolean,
            required: false,
            defaults: true,
        });
    }

    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('Stylelint Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    get writing() {
        return {
            stylelintrc() {
                const srcPath = this.templatePath('stylelintrc');
                const destPath = this.destinationPath('.stylelintrc');
                this.fs.copyTpl(srcPath, destPath, {
                    camelCase: this.options['camel-case'],
                });
            },

            dependencies() {
                this.addDevDependencies({
                    stylelint: '^15.0.0',
                    'stylelint-config-standard-scss': '^7.0.1',
                    'stylelint-config-idiomatic-order': '^9.0.0',
                    'stylelint-config-standard': '^30.0.1',
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
