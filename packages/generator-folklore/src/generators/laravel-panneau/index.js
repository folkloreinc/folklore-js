import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import fs from 'fs';
import glob from 'glob';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class LaravelPanneauGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Laravel Panneau Generator');
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

            instructions() {
                if (this.options.quiet) {
                    return;
                }

                console.log('\n\n');
                console.log(chalk.yellow('\n----------------------'));
                console.log('Instructions');
                console.log(chalk.yellow('----------------------\n'));
                console.log(`Add to ${chalk.yellow('app/Providers/AppServiceProvider.php')}:`);
                console.log(path.join(__dirname, './instructions/ServiceProvider.txt'));
                const serviceProvider = fs.readFileSync(
                    path.join(__dirname, './instructions/ServiceProvider.txt'),
                );
                console.log(highlight(serviceProvider.toString('utf-8'), { language: 'php', ignoreIllegals: true }));
            },
        };
    }

    get writing() {
        return {
            composerJSON() {
                this.composerJson.merge({
                    require: {
                        'folklore/laravel-panneau': 'v1.2.x-dev',
                    },
                });
            },

            packageJSON() {
                this.addDependencies([
                    '@panneau/app@^1.0.3-alpha.1',
                    '@panneau/core@^1.0.3-alpha.1',
                    '@panneau/data@^1.0.3-alpha.1',
                    '@panneau/field-text@^1.0.3-alpha.1',
                    '@panneau/field-localized@^1.0.3-alpha.1',
                ]);
            },

            config() {
                const source = this.templatePath('config.php');
                const destination = this.destinationPath('config/panneau.php');
                if (this.fs.exists(destination)) {
                    this.fs.delete(destination);
                }
                this.fs.copyTpl(source, destination, {});
            },

            routes() {
                const source = this.templatePath('routes.php');
                const destination = this.destinationPath('routes/panneau.php');
                if (this.fs.exists(destination)) {
                    this.fs.delete(destination);
                }
                this.fs.copyTpl(source, destination, {});
            },

            layout() {
                const source = this.templatePath('layout.blade.php');
                const destination = this.destinationPath(
                    'resources/views/vendor/panneau/layout.blade.php',
                );
                if (this.fs.exists(destination)) {
                    this.fs.delete(destination);
                }
                this.fs.copyTpl(source, destination, {});
            },

            app() {
                const source = this.templatePath('app.blade.php');
                const destination = this.destinationPath(
                    'resources/views/vendor/panneau/app.blade.php',
                );
                if (this.fs.exists(destination)) {
                    this.fs.delete(destination);
                }
                this.fs.copyTpl(source, destination, {});
            },

            indexJs() {
                const source = this.templatePath('index.js');
                const destination = this.destinationPath('resources/assets/js/index.js');
                this.fs.copyTpl(source, destination, {});
            },

            files() {
                const folders = ['app', 'resources', 'lang'];
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
            async npm() {
                if (this.options['skip-install']) {
                    return;
                }

                await this.spawnCommand('npm', ['install']);
            },

            async composer() {
                if (this.options['skip-install']) {
                    return;
                }

                await this.spawnCommand('composer', ['install']);
            },

            async vendorPublish() {
                if (this.options['skip-install']) {
                    return;
                }

                await this.spawnCommand('php', [
                    'artisan',
                    'vendor:publish',
                    '--provider=Panneau\\ServiceProvider',
                ]);
            },
        };
    }
};
