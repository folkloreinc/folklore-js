import chalk from 'chalk';

import Generator from '../../lib/generator';

module.exports = class TypescriptGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });

        this.option('skip-install', {
            type: Boolean,
            required: false,
            defaults: false,
        });
    }

    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('Typescript Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    get writing() {
        return {
            tsconfig() {
                const srcPath = this.templatePath('_tsconfig.json');
                const destPath = this.destinationPath('tsconfig.json');
                this.fs.copyTpl(srcPath, destPath, {
                    srcPath: this.options['src-path'],
                });
            },

            dependencies() {
                this.addDevDependencies({
                    '@tsconfig/create-react-app': '^2.0.9',
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
