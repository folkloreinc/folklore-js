import chalk from 'chalk';
import glob from 'glob';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class LaravelMediathequeGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.argument('overrides', {
            type: Boolean,
            required: false,
            default: false,
        });

        this.argument('skip-publish', {
            type: Boolean,
            required: false,
            default: false,
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Laravel Mediatheque Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts).then((answers) => {
                    if (answers['project-name']) {
                        this.options['project-name'] = answers['project-name'];
                    }
                });
            },
        };
    }

    get writing() {
        return {
            composerJSON() {
                this.composerJson.merge({
                    require: {
                        'folklore/laravel-folklore': 'v1.x-dev',
                        'folklore/laravel-mediatheque': 'v1.1.x-dev',
                    },
                });
            },

            files() {
                if (!this.options.overrides) {
                    return
                }
                const folders = ['app'];
                folders.forEach((folder) => {
                    const templatePath = this.templatePath(folder);
                    const destinationPath = this.destinationPath(folder);
                    glob.sync('**', {
                        dot: true,
                        nodir: true,
                        cwd: templatePath,
                    }).forEach((file) => {
                        const source = path.join(templatePath, file);
                        const destination = path.join(destinationPath, file);
                        if (file.match(/\.(jpg|jpeg|gif|png)$/i)) {
                            this.fs.copy(source, destination);
                        } else {
                            this.fs.copyTpl(source, destination, {
                                project_name: this.options['project-name'],
                            });
                        }
                    });
                });
            },
        };
    }

    get install() {
        return {
            composer() {
                if (this.options['skip-install']) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('composer', ['install']).on('close', done);
            },

            async vendorPublish() {
                if (this.options['skip-publish']) {
                    return;
                }

                await this.spawnCommand('php', [
                    'artisan',
                    'vendor:publish',
                    '--provider=Folklore\\Mediatheque\\ServiceProvider',
                ]);
            },
        };
    }
};
