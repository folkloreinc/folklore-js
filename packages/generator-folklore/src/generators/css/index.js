import chalk from 'chalk';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class CssGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('path', {
            type: String,
            defaults: 'src/css',
        });

        this.stylesPath = (destPath) =>
            this.destinationPath(path.join(this.options.path, destPath || ''));
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('CSS Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(CssGenerator.prompts.project_name);
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
            styles() {
                const srcPath = this.templatePath('styles.css');
                const destPath = this.stylesPath('styles.css');
                this.fs.copy(srcPath, destPath);
            },

            theme() {
                const srcPath = this.templatePath('theme.css');
                const destPath = this.stylesPath('theme.css');
                this.fs.copy(srcPath, destPath);
            },

            themes() {
                const srcPath = this.templatePath('theme');
                const destPath = this.stylesPath('theme');
                this.fs.copy(srcPath, destPath);
            },

            dependencies() {
                this.addDependencies({
                    'sanitize.css': '^13.0.0',
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
