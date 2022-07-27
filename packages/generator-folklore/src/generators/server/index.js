import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class ServerGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.option('path', {
            type: String,
            defaults: 'src',
        });

        this.option('filename', {
            type: String,
            defaults: 'server.js',
        });

        this.option('socket-io', {
            type: String,
            defaults: false,
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Server Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            index() {
                const { filename, path: serverPath, 'socket-io': socketIo } = this.options;
                this.fs.copyTpl(
                    this.templatePath('server.js'),
                    this.destinationPath(path.join(serverPath, filename)),
                    {
                        socketIo,
                    }
                );
            },

            dependencies() {
                const { 'socket-io': socketIo } = this.options;
                this.addDependencies(['commander', 'debug', 'ejs', 'express']);
                if (socketIo) {
                    this.addDependencies(['socket.io']);
                }
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
