import chalk from 'chalk';
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
                    '@panneau/app@^1.0.0-alpha.193',
                    '@panneau/core@^1.0.0-alpha.193',
                ]);
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
                const destination = this.destinationPath(
                    'resources/assets/js/index.js',
                );
                this.fs.copyTpl(source, destination, {});
            },

            npmDependencies() {
                this.addDependencies([
                    '@panneau/app@^1.0.0-alpha.193',
                    '@panneau/core@^1.0.0-alpha.193',
                    '@panneau/data@^1.0.0-alpha.193',
                    '@panneau/field-text@^1.0.0-alpha.193',
                    '@panneau/field-localized@^1.0.0-alpha.193',
                ]);
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
