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
                const srcPath = this.templatePath('config');
                const destPath = this.destinationPath('rollup.config.js');
                this.fs.copyTpl(srcPath, destPath);
            },

            dependencies() {
                this.addDevDependencies([
                    '@rollup/plugin-babel',
                    '@rollup/plugin-commonjs',
                    '@rollup/plugin-json',
                    '@rollup/plugin-node-resolve',
                    '@rollup/plugin-replace',
                    'rollup',
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
