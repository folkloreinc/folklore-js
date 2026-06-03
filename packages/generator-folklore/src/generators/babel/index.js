import chalk from 'chalk';

import Generator from '../../lib/generator';

export default class BabelGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('transform-runtime', {
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
        console.log('Babel Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    get writing() {
        return {
            config() {
                const { 'transform-runtime': transformRuntime } = this.options;

                const srcPath = this.templatePath('config.ejs');
                const destPath = this.destinationPath('babel.config.js');
                this.fs.copyTpl(srcPath, destPath, {
                    transformRuntime,
                });
            },

            dependencies() {
                this.addDevDependencies({
                    '@babel/plugin-transform-runtime': 'latest',
                    'babel-plugin-formatjs': '^11.3.7',
                    'babel-plugin-lodash': '^3.3.4',
                    'babel-plugin-react-compiler': '^1.0.0',
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
