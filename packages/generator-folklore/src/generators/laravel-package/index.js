import _ from 'lodash';
import chalk from 'chalk';
import path from 'path';
import { pascalCase } from 'change-case';
import Generator from '../../lib/generator';

module.exports = class ComposerPackageGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('package-name', {
            type: String,
            required: false,
        });

        this.option('package-namespace', {
            type: String,
            desc: 'Package namespace',
            required: false,
        });

        this.option('src', {
            type: Boolean,
            desc: 'Includes src path',
            defaults: true,
        });

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Composer Package Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['package-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'package-name',
                        message: 'Name of the package:',
                        default: () => {
                            const parts = process.cwd().split(path.sep);
                            return `folklore/${parts[parts.length - 1]}`;
                        },
                    });
                }

                if (!this.options['package-namespace']) {
                    prompts.push({
                        type: 'input',
                        name: 'package-namespace',
                        message: 'Namespace of the package:',
                        default: (answers) => {
                            const packageName = (this.options['package-name'] || answers['package-name']);
                            const namespace = packageName.split('/').map(part => pascalCase(part)).join('\\');
                            return namespace;
                        },
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers['package-name']) {
                            this.options['package-name'] = answers['package-name'];
                        }
                        if (answers['package-namespace']) {
                            this.options['package-namespace'] = answers['package-namespace'];
                        }
                    });
            },
        };
    }

    configuring() {
        const namespaceParts = this.options['package-namespace'].split('\\');
        const baseName = namespaceParts[1];
        this.templateData = {
            packageName: this.options['package-name'],
            namespace: this.options['package-namespace'],
            namespacePath: namespaceParts.join('/'),
            baseClassName: pascalCase(baseName),
            basePath: this.options['package-name'],
            baseName,
        };

        this.composeWith('folklore:editorconfig', {
            quiet: true,
        });
    }

    get writing() {
        return {
            src() {
                const srcPath = this.templatePath('src');
                const destPath = this.destinationPath('src');
                this.fs.copyTpl(srcPath, destPath, this.templateData);
            },

            testsDirectory() {
                const srcPath = this.templatePath('tests');
                const destPath = this.destinationPath('tests');
                this.fs.copyTpl(srcPath, destPath, this.templateData);
            },

            serviceProvider() {
                const { namespacePath, baseClassName } = this.templateData;
                const srcPath = this.templatePath('ServiceProvider.php');
                const destPath = this.destinationPath(`src/${namespacePath}/${baseClassName}ServiceProvider.php`);
                this.fs.copyTpl(srcPath, destPath, this.templateData);
            },

            tests() {
                const featureSrcPath = this.templatePath('Test.php');
                const featureDestPath = this.destinationPath('tests/Feature/FeatureTest.php');
                this.fs.copyTpl(featureSrcPath, featureDestPath, {
                    baseClassName: 'Feature',
                });

                const unitSrcPath = this.templatePath('Test.php');
                const unitDestPath = this.destinationPath('tests/Unit/UnitTest.php');
                this.fs.copyTpl(unitSrcPath, unitDestPath, {
                    baseClassName: 'Unit',
                });
            },

            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.destinationPath('.gitignore');
                this.fs.copy(srcPath, destPath);
            },

            coveralls() {
                const srcPath = this.templatePath('coveralls.yml');
                const destPath = this.destinationPath('.coveralls.yml');
                this.fs.copy(srcPath, destPath);
            },

            travis() {
                const srcPath = this.templatePath('travis.yml');
                const destPath = this.destinationPath('.travis.yml');
                this.fs.copy(srcPath, destPath);
            },

            phpcs() {
                const srcPath = this.templatePath('phpcs.xml');
                const destPath = this.destinationPath('phpcs.xml');
                this.fs.copy(srcPath, destPath);
            },

            phpunit() {
                const srcPath = this.templatePath('phpunit.xml');
                const destPath = this.destinationPath('phpunit.xml');
                this.fs.copyTpl(srcPath, destPath, this.templateData);
            },

            readme() {
                const srcPath = this.templatePath('Readme.md');
                const destPath = this.destinationPath('Readme.md');
                this.fs.copy(srcPath, destPath);
            },

            composerJSON() {
                const { packageName, namespace } = this.templateData;
                const srcPath = this.templatePath('_composer.json');
                const destPath = this.destinationPath('composer.json');
                const newJson = this.fs.readJSON(srcPath);
                newJson.name = packageName;
                newJson.autoload['psr-0'] = {
                    [namespace]: 'src/',
                };
                const currentJson = this.fs.exists(destPath) ?
                    this.fs.readJSON(destPath) : {};
                this.fs.writeJSON(destPath, _.merge(newJson, currentJson));
            },
        };
    }

    get install() {
        return {
            composer() {
                const skipInstall = _.get(this.options, 'skip-install', false);
                if (skipInstall) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('composer', ['install']).on('close', done);
            },
        };
    }
};
