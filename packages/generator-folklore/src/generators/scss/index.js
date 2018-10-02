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

        this.option('react', {
            type: Boolean,
            required: false,
            defaults: false,
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

    configuring() {
        this.composeWith('folklore:stylelint', {
            quiet: true,
            'camel-case': this.options.react,
        });
    }

    get writing() {
        return {
            main() {
                const reactSuffix = this.options.react ? '.global' : '';
                const srcPath = this.templatePath('main.scss');
                const destPath = this.stylesPath(`main${reactSuffix}.scss`);
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
