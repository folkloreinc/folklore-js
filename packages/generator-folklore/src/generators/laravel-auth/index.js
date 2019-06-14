import _ from 'lodash';
import chalk from 'chalk';
import glob from 'glob';
import path from 'path';
import Generator from '../../lib/generator';

module.exports = class LaravelAuthGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('js-path', {
            type: String,
            defaults: 'resources/assets/js',
        });

        this.option('styles-path', {
            type: String,
            defaults: 'resources/assets/styles',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Laravel Auth Generator');
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

            files() {
                const folders = ['app', 'resources', 'routes', 'database'];

                const jsPath = this.options['js-path'] || null;
                const stylesPath = this.options['styles-path'] || null;

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
                                getRelativeStylesPath: (from, src) => path.relative(
                                    this.destinationPath(path.dirname(path.join(jsPath, from))),
                                    this.destinationPath(
                                        path.join(stylesPath || path.join(jsPath, 'styles'), src),
                                    ),
                                ),
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
        };
    }
};
