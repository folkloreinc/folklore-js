import chalk from 'chalk';
import path from 'path';
import Generator from '../../lib/generator';

module.exports = class ScssGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('path', {
            type: String,
            defaults: 'src/scss',
        });

        this.stylesPath = destPath => this.destinationPath(path.join(
            this.options.path,
            destPath || '',
        ));
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('SCSS Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(ScssGenerator.prompts.project_name);
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
            styles() {
                const srcPath = this.templatePath('styles.scss');
                const destPath = this.stylesPath('styles.scss');
                this.fs.copy(srcPath, destPath);
            },

            commmons() {
                const srcPath = this.templatePath('commons');
                const destPath = this.stylesPath('commons');
                this.fs.copy(srcPath, destPath);
            },
        };
    }
};
