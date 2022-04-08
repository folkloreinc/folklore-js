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

    writing() {
        const srcPath = this.templatePath('prettierrc.json');
        const destPath = this.destinationPath('.prettierrc.json');
        this.fs.copy(srcPath, destPath);
    }

    install() {
        this.addDevDependencies([
            'prettier',
            '@prettier/plugin-php',
        ]);
    }
};
