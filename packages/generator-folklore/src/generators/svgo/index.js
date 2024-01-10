import chalk from 'chalk';

import Generator from '../../lib/generator';

module.exports = class SvgoGenerator extends Generator {
    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('SVGO Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    writing() {
        const srcPath = this.templatePath('config.js');
        const destPath = this.destinationPath('svgo.config.js');
        this.fs.copy(srcPath, destPath);
    }
};
