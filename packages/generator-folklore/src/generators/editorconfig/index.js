import chalk from 'chalk';

import Generator from '../../lib/generator';

export default class EditorConfigGenerator extends Generator {
    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('Editor Config Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    writing() {
        const srcPath = this.templatePath('editorconfig');
        const destPath = this.destinationPath('.editorconfig');
        this.fs.copy(srcPath, destPath);
    }
}
