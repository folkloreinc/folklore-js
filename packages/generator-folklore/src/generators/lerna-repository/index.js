import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class LernaRepositoryGenerator extends Generator {
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

        this.composeWith('folklore:sass-lint', {
            quiet: true,
            'camel-case': true,
        });

        this.composeWith('folklore:editorconfig', {
            quiet: true,
        });

        this.composeWith('folklore:babel', {
            quiet: true,
        });

        this.composeWith('folklore:build', {
            'project-name': this.options['project-name'],
            'tmp-path': '.tmp',
            'src-path': 'src',
            'dest-path': 'dist',
            'js-path': '',
            'clean-dest': true,
            'hot-reload': true,
            'webpack-entries': {},
            browsersync: false,
            'skip-install': skipInstall,
            quiet: true,
        });
    }

    get writing() {
        return {
            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.destinationPath('.gitignore');
                this.fs.copy(srcPath, destPath);
            },

            npmrc() {
                const srcPath = this.templatePath('npmrc');
                const destPath = this.destinationPath('.npmrc');
                this.fs.copy(srcPath, destPath);
            },

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

            jest() {
                const srcPath = this.templatePath('jest.config.js');
                const destPath = this.destinationPath('jest.config.js');
                this.fs.copy(srcPath, destPath);
            },

            readme() {
                const srcPath = this.templatePath('Readme.md');
                const destPath = this.destinationPath('Readme.md');
                this.fs.copy(srcPath, destPath);
            },

            buildTranslations() {
                const srcPath = this.templatePath('buildPackageTranslations.js');
                const destPath = this.destinationPath('build/buildPackageTranslations.js');
                this.fs.copy(srcPath, destPath);

                const allSrcPath = this.templatePath('buildAllTranslations.js');
                const allDestPath = this.destinationPath('build/buildAllTranslations.js');
                this.fs.copy(allSrcPath, allDestPath);
            },

            buildLib() {
                const srcPath = this.templatePath('lib');
                const destPath = this.destinationPath('build/lib');
                this.fs.copy(srcPath, destPath);
            },

            packages() {
                const srcPath = this.templatePath('packages/.gitkeep');
                const destPath = this.destinationPath('packages/.gitkeep');
                this.fs.copy(srcPath, destPath);
            },
        };
    }

    get install() {
        return {
            npm() {
                this.npmInstall([
                    'lerna@latest',
                    'glob@latest',
                    'mkdirp@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
