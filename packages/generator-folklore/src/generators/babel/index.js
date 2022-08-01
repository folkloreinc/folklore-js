import chalk from 'chalk';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class BabelGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('react', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.option('transform-runtime', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.option('react-intl', {
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
                const {
                    react,
                    'transform-runtime': transformRuntime,
                    'react-intl': reactIntl,
                } = this.options;

                const srcPath = this.templatePath('config.js');
                const destPath = this.destinationPath('babel.config.js');
                this.fs.copyTpl(srcPath, destPath, {
                    react,
                    transformRuntime,
                    reactIntl,
                });
            },

            dependencies() {
                this.addDevDependencies([
                    '@babel/cli',
                    '@babel/core',
                    '@babel/node',
                    '@babel/plugin-transform-runtime',
                    '@babel/preset-env',
                    '@babel/preset-react',
                ]);
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
