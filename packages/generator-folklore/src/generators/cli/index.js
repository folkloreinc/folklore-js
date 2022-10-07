import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class CliGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.option('path', {
            type: String,
            defaults: 'src',
        });

        this.option('filename', {
            type: String,
            defaults: 'cli.js',
        });

        this.option('commands', {
            type: Boolean,
            defaults: false,
        });

        this.option('commands-path', {
            type: String,
            defaults: './commands'
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('CLI Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            index() {
                const { filename, path: cliPath, commands } = this.options;
                this.fs.copyTpl(
                    this.templatePath('cli.js'),
                    this.destinationPath(path.join(cliPath, filename)),
                    {
                        commands,
                    }
                );
            },

            commands() {
                if (!this.options.commands) {
                    return;
                }
                const templateData = {};

                const commandsPath =
                    this.options['commands-path'] || path.join(this.options.path, 'commands');
                const srcPath = this.templatePath('commands');
                const destPath = this.destinationPath(commandsPath);
                this.fs.copyTpl(srcPath, destPath, templateData);
            },

            dependencies() {
                this.addDependencies({
                    'commander': 'latest',
                    'debug': 'latest',
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
