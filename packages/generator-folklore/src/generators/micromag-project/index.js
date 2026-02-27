import chalk from 'chalk';
import path from 'path';

import Generator from '../../lib/generator';

export default class MicromagProjectGenerator extends Generator {
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

        this.option('kiosk', {
            type: Boolean,
            required: false,
            defaults: false,
        });

        this.relativeStylesPath = (from, src) =>
            path.relative(
                this.destinationPath(path.dirname(path.join(this.options['src-path'], from))),
                this.destinationPath(path.join(path.join(this.options['src-path'], 'styles'), src)),
            );

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

                console.log('Kiosk mode: ' + (this.options.kiosk ? 'Enabled' : 'Disabled'));
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

    conflicts() {
        const { kiosk = false } = this.options;

        const files = {
            'index.html.ejs': 'index.html.ejs',
            'components/App.tsx': 'App.tsx',
            'components/Routes.tsx': kiosk ? 'kiosk/Routes.tsx' : 'Routes.tsx',
            'styles/styles.css': kiosk ? 'kiosk/styles.css' : 'styles.css',
            'components/layouts/Main.tsx': 'Layout.tsx',
            'styles/layouts/main.module.css': 'layout.module.css',
            'components/pages/Home.tsx': kiosk ? 'kiosk/HomePage.tsx' : null,
            'styles/pages/home.module.css': kiosk ? 'kiosk/home-page.module.css' : null,
        };

        Object.keys(files).forEach((destFile) => {
            if (files[destFile] === null) {
                return;
            }

            this.fs.delete(this.srcPath(destFile));

            this.fs.copyTpl(this.templatePath(files[destFile]), this.srcPath(destFile), {
                getRelativeStylesPath: this.relativeStylesPath,
            });
        });
    }

    get writing() {
        return {
            data() {
                const { kiosk = false } = this.options;
                this.fs.copyTpl(
                    this.templatePath('data.json'),
                    this.srcPath(kiosk ? 'micromags/test/data.json' : 'micromag/data.json'),
                );
                this.fs.copyTpl(
                    this.templatePath(kiosk ? 'kiosk/micromags.ts' : 'micromags.ts'),
                    this.srcPath('micromags.ts'),
                );
            },

            micromagPage() {
                this.fs.copyTpl(
                    this.templatePath('MicromagPage.tsx'),
                    this.srcPath('components/pages/Micromag.tsx'),
                    {
                        getRelativeStylesPath: this.relativeStylesPath,
                    },
                );
            },

            types() {
                this.fs.copyTpl(this.templatePath('types'), this.srcPath('types'), {
                    getRelativeStylesPath: this.relativeStylesPath,
                });
            },

            styles() {
                this.fs.copyTpl(this.templatePath('styles'), this.srcPath('styles'), {
                    getRelativeStylesPath: this.relativeStylesPath,
                });
            },

            hooks() {
                this.fs.copyTpl(this.templatePath('hooks'), this.srcPath('hooks'), {
                    getRelativeStylesPath: this.relativeStylesPath,
                });
            },

            contexts() {
                this.fs.copyTpl(this.templatePath('contexts'), this.srcPath('contexts'), {
                    getRelativeStylesPath: this.relativeStylesPath,
                });
            },

            lib() {
                this.fs.copyTpl(this.templatePath('lib'), this.srcPath('lib'), {
                    getRelativeStylesPath: this.relativeStylesPath,
                });
            },

            partials() {
                this.fs.copyTpl(
                    this.templatePath('partials'),
                    this.srcPath('components/partials'),
                    {
                        getRelativeStylesPath: this.relativeStylesPath,
                    },
                );
            },

            modals() {
                this.fs.copyTpl(this.templatePath('modals'), this.srcPath('components/modals'), {
                    getRelativeStylesPath: this.relativeStylesPath,
                });
            },

            icons() {
                this.fs.copyTpl(this.templatePath('icons'), this.srcPath('components/icons'), {
                    getRelativeStylesPath: this.relativeStylesPath,
                });
            },

            dependencies() {
                this.addDependencies({
                    '@micromag/viewer': '^0.3.767',
                    '@micromag/data': '^0.3.767',
                    '@micromag/core': '^0.3.767',
                    '@micromag/consent': '^0.3.767',
                    '@micromag/intl': '^0.3.767',
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
}
