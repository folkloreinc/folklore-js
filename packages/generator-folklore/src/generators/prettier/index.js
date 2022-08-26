import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class PrettierGenerator extends Generator {
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
                this.addDevDependencies([
                    'prettier@^2.0.0',
                    '@prettier/plugin-php@^0.18.0',
                    '@trivago/prettier-plugin-sort-imports@^3.0.0',
                ]);
            }
        }

    }

    async install() {
        if (this.options['skip-install']) {
            return;
        }

        await this.spawnCommand('npm', ['install']);
    }
};
