import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';
import { ensureLeadingDotSlash } from '../../lib/utils';

module.exports = class MicromagProjectGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });

        this.option('dest-path', {
            type: String,
            desc: 'Path for build',
            defaults: './dist',
        });

        this.srcPath = (filePath) =>
            this.destinationPath(path.join(this.options['src-path'], filePath));
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Micromag Project Generator');
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

    async configuring() {
        const {
            'project-name': projectName,
            'src-path': srcPath,
            'dest-path': destPath,
        } = this.options;

        await this.composeWith('folklore:html-project', {
            'skip-install': true,
            quiet: true,
            'project-name': projectName,
            'src-path': srcPath,
            'dest-path': destPath,
        });
    }

    get conflicts() {
        return {
            home() {
                const { 'src-path': srcPath } = this.options;
                const templateData = {
                    getRelativeStylesPath: (from, src) =>
                        path.relative(
                            this.destinationPath(path.dirname(path.join(srcPath, from))),
                            this.destinationPath(path.join(path.join(srcPath, 'styles'), src)),
                        ),
                };

                this.fs.delete(this.srcPath('components/pages/Home.jsx'));
                this.fs.delete(this.srcPath('styles/pages/home.module.scss'));

                this.fs.copyTpl(
                    this.templatePath('Home.jsx'),
                    this.srcPath('components/pages/Home.jsx'),
                    templateData,
                );

                this.fs.copyTpl(
                    this.templatePath('home.module.scss'),
                    this.srcPath('styles/pages/home.module.scss'),
                    templateData,
                );
            },

            routes() {
                const { 'src-path': srcPath } = this.options;
                const templateData = {
                    getRelativeStylesPath: (from, src) =>
                        path.relative(
                            this.destinationPath(path.dirname(path.join(srcPath, from))),
                            this.destinationPath(path.join(path.join(srcPath, 'styles'), src)),
                        ),
                };

                this.fs.delete(this.srcPath('components/Routes.jsx'));

                this.fs.copyTpl(
                    this.templatePath('Routes.jsx'),
                    this.srcPath('components/Routes.jsx'),
                    templateData,
                );
            },

            styles() {
                this.fs.delete(this.srcPath('styles/styles.scss'));

                this.fs.copyTpl(
                    this.templatePath('styles.scss'),
                    this.srcPath('styles/styles.scss'),
                );
            },

            micromag() {
                this.fs.copyTpl(this.templatePath('data.json'), this.srcPath('micromag/data.json'));
            },

            dependencies() {
                this.addDependencies({
                    '@micromag/viewer': '^0.3.488',
                    '@micromag/intl': '^0.3.488',
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
