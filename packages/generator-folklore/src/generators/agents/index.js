import chalk from 'chalk';

import Generator from '../../lib/generator';

export default class AgentsGenerator extends Generator {
    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('AGENTS.md Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    writing() {
        const destPath = this.destinationPath('AGENTS.md');

        const hasComposerJson = this.fs.exists(this.destinationPath('composer.json'));
        const hasPackageJson = this.fs.exists(this.destinationPath('package.json'));

        const existingContent = this.fs.exists(destPath) ? this.fs.read(destPath) : '';

        const separator = '\n\n---\n\n';
        const parts = [
            this.fs.read(this.templatePath('general.md')),
            hasComposerJson ? this.fs.read(this.templatePath('laravel.md')) : null,
            hasPackageJson ? this.fs.read(this.templatePath('frontend.md')) : null,
            this.fs.read(this.templatePath('after.md')),
        ]
            .filter((it) => it !== null)
            .join(separator);

        const newContent =
            existingContent.length > 0 ? `${existingContent}${separator}${parts}` : parts;

        this.fs.write(destPath, newContent);
    }
}
