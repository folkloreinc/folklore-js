import chalk from 'chalk';

import Generator from '../../lib/generator';

export default class PrettierGenerator extends Generator {
    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }
                console.log(chalk.yellow('\n----------------------'));
                console.log('Prettier Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            prettierrc() {
                const srcPath = this.templatePath('prettierrc.json');
                const destPath = this.destinationPath('.prettierrc.json');
                this.fs.copy(srcPath, destPath);
            },

            dependencies() {
                this.addDevDependencies({
                    prettier: '^3.6.2',
                    '@prettier/plugin-php': '^0.24.0',
                    '@trivago/prettier-plugin-sort-imports': '^6.0.0',
                    'stylelint-prettier': '^5.0.3',
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
}
