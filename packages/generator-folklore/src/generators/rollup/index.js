import chalk from 'chalk';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class RollupGenerator extends Generator {
    constructor(...args) {
        super(...args);
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Rollup Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            config() {
                const srcPath = this.templatePath('config.js');
                const destPath = this.destinationPath('rollup.config.js');
                this.fs.copyTpl(srcPath, destPath);
            },

            dependencies() {
                this.addDevDependencies({
                    '@rollup/plugin-babel': 'latest',
                    '@rollup/plugin-commonjs': 'latest',
                    '@rollup/plugin-json': 'latest',
                    '@rollup/plugin-node-resolve': 'latest',
                    '@rollup/plugin-replace': 'latest',
                    rollup: '^2.79.1',
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
