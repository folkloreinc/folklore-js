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

        this.option('features', {
            type: String,
            required: false,
            defaults: 'documentation,storybook',
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

                prompts.push({
                    type: 'checkbox',
                    name: 'features',
                    message: 'List of features:',
                    choices: [
                        {
                            name: 'Documentation',
                            value: 'documentation',
                        },
                        {
                            name: 'Storybook',
                            value: 'storybook',
                        },
                    ],
                    default: () => this.options.features.split(','),
                });

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts).then((answers) => {
                    if (answers['project-name']) {
                        this.options['project-name'] = answers['project-name'];
                    }
                    if (answers.features) {
                        this.options.features = answers.features;
                    }
                });
            },
        };
    }

    configuring() {
        this.options.features = _.isString(this.options.features)
            ? this.options.features.split(',')
            : this.options.features;
        this.composeWith('folklore:eslint', {
            'skip-install': this.options['skip-install'],
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
            'skip-install': this.options['skip-install'],
            quiet: true,
            compile: true,
            'transform-runtime': true,
            'hot-reload': true,
            'react-intl': true,
        });

        this.composeWith('folklore:test', {
            'skip-install': this.options['skip-install'],
            quiet: true,
            type: 'jest',
        });

        this.composeWith('folklore:build', {
            'skip-install': this.options['skip-install'],
            quiet: true,
            'project-name': this.options['project-name'],
            'tmp-path': '.tmp',
            'src-path': 'src',
            'dest-path': 'dist',
            'js-path': '',
            'clean-dest': true,
            'hot-reload': true,
            'webpack-entries': {},
            'npm-scripts': false,
            browsersync: false,
            lerna: true,
        });

        if (this.options.features.indexOf('storybook') !== -1) {
            this.composeWith('folklore:storybook', {
                quiet: true,
                'skip-install': this.options['skip-install'],
                pattern: '../packages/*/src/__stories__/*.story.jsx',
            });
        }

        if (this.options.features.indexOf('documentation') !== -1) {
            this.composeWith('folklore:docs', {
                quiet: true,
                'skip-install': this.options['skip-install'],
                language: 'js',
            });
        }
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
                const currentPackageJSON = this.fs.exists(destPath)
                    ? this.fs.readJSON(destPath)
                    : {};
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
                const srcPath = this.templatePath('build-package-translations.js');
                const destPath = this.destinationPath('build/build-package-translations.js');
                this.fs.copy(srcPath, destPath);

                const allSrcPath = this.templatePath('build-all-translations.js');
                const allDestPath = this.destinationPath('build/build-all-translations.js');
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

            storybook() {
                this.fs.copy(this.templatePath('storybook'), this.destinationPath('.storybook'));
                this.fs.copy(
                    this.templatePath('storybook-package'),
                    this.destinationPath('.storybook-package'),
                );
            },
        };
    }

    get install() {
        return {
            npm() {
                if (this.options['skip-install']) {
                    return;
                }

                this.npmInstall(
                    ['lerna@latest', 'glob@latest', 'mkdirp@latest', '@babel/runtime@latest'],
                    {
                        'save-dev': true,
                    },
                );
            },

            bootstrap() {
                if (this.options['skip-install']) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('lerna', ['bootstrap']).on('close', done);
            },
        };
    }
};
