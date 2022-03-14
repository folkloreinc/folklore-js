import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class BrowsersListGenerator extends Generator {
    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Browsers list Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            editorconfig() {
                const srcPath = this.templatePath('browserslistrc');
                const destPath = this.destinationPath('.browserslistrc');
                this.fs.copy(srcPath, destPath);
            },
        };
    }
};
