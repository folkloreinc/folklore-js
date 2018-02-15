import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class LernaPackageGenerator extends Generator {

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
                console.log('Lerna Repository Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'project-name',
                        message: 'Name of the repository:',
                        default: () => {
                            const parts = process.cwd().split(path.sep);
                            return parts[parts.length - 1];
                        },
                    });
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
        const skipInstall = _.get(this.options, 'skip-install', false);

        this.composeWith('folklore:eslint', {
            'skip-install': skipInstall,
            quiet: true,
        });

        this.composeWith('folklore:editorconfig', {
            quiet: true,
        });
    }

    get writing() {
        return {
            lernaJSON() {
                const srcPath = this.templatePath('_lerna.json');
                const destPath = this.destinationPath('lerna.json');
                this.fs.copy(srcPath, destPath);
            },

            packageJSON() {
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath('package.json');
                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.name = this.options['project-name'];
                const currentPackageJSON = this.fs.exists(destPath) ?
                    this.fs.readJSON(destPath) : {};
                this.fs.writeJSON(destPath, _.merge(packageJSON, currentPackageJSON));
            },
        };
    }

    get install() {
        return {
            npm() {
                this.npmInstall([
                    'lerna@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
