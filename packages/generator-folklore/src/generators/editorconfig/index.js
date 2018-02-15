import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class EditorConfigGenerator extends Generator {
    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Editor Config Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            editorconfig() {
                const srcPath = this.templatePath('editorconfig');
                const destPath = this.destinationPath('.editorconfig');
                this.fs.copy(srcPath, destPath);
            },
        };
    }
};
