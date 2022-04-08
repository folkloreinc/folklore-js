import _ from 'lodash';
import chalk from 'chalk';
import glob from 'glob';
import path from 'path';
import Generator from '../../lib/generator';

module.exports = class LaravelPanneauGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('install-npm', {
            type: Boolean,
            desc: 'Install NPM dependencies',
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

                return this.prompt(prompts)
                    .then((answers) => {
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
                const srcPath = this.templatePath('_composer.json');
                const destPath = this.destinationPath('composer.json');

                const newJson = this.fs.readJSON(srcPath);
                const currentJson = this.fs.exists(destPath)
                    ? this.fs.readJSON(destPath)
                    : {};
                this.fs.writeJSON(destPath, _.merge(currentJson, newJson));
            },

            packageJSON() {
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath('package.json');

                const newJson = this.fs.readJSON(srcPath);
                const currentJson = this.fs.exists(destPath)
                    ? this.fs.readJSON(destPath)
                    : {};
                this.fs.writeJSON(destPath, _.merge(currentJson, newJson));
            },

            layout() {
                const source = this.templatePath('layout.blade.php');
                const destination = this.destinationPath('resources/views/vendor/panneau/index.blade.php');
                if (this.fs.exists(destination)) {
                    this.fs.delete(destination);
                }
                this.fs.copyTpl(source, destination, {});
            },

            files() {
                const folders = ['app', 'resources'];
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

            vendorPublish() {
                if (this.options['skip-install']) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('php', ['artisan', 'vendor:publish', '--all']).on('close', done);
            },

            panneau() {
                if (this.options['skip-install'] && !this.options['install-npm']) {
                    return;
                }

                this.addDependencies(['panneau@^0.6.53']);
            },
        };
    }
};
