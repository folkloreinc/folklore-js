import chalk from 'chalk';

import Generator from '../../lib/generator';

export default class PostcssGenerator extends Generator {
    constructor(...args) {
        super(...args);
    }

    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('PostCSS Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    get writing() {
        return {
            config() {
                this.fs.copyTpl(
                    this.templatePath('config.js'),
                    this.destinationPath('postcss.config.js'),
                );
            },

            dependencies() {
                this.addDevDependencies({
                    'postcss-custom-media': '^10.0.0',
                    'postcss-import': '^16.0.0',
                    'postcss-normalize': '^10.0.1',
                    'postcss-preset-env': '^9.0.0',
                    '@csstools/postcss-global-data': '^2.0.0',
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
