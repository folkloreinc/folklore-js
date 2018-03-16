import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import get from 'lodash/get';
import { pascal as pascalCase, snake as snakeCase } from 'change-case';
import Generator from '../../lib/generator';

module.exports = class LernaPackageGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.argument('package-name', {
            type: String,
            required: false,
        });

        this.option('type', {
            type: String,
            required: false,
        });

        const lernaJSON = this.fs.readJSON(this.destinationPath('lerna.json'));
        const packageFolders = lernaJSON.packages.map(it => it.replace(/\/\*$/, ''));

        this.option('package-folder', {
            type: String,
            required: false,
            defaults: packageFolders.length <= 1 ? get(packageFolders, 0) : undefined,
        });

        this.packagePath = (destPath) => {
            const nameParts = this.options['package-name'].split('/');
            return this.destinationPath(path.join(
                this.options['package-folder'],
                nameParts[nameParts.length - 1],
                destPath,
            ));
        };
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Lerna Package Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                const lernaJSON = this.fs.readJSON(this.destinationPath('lerna.json'));
                const packageFolders = lernaJSON.packages.map(it => it.replace(/\/\*$/, ''));

                if (!this.options['package-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'package-name',
                        message: 'Name of the package:',
                        default: () => {
                            const parts = process.cwd().split(path.sep);
                            return parts[parts.length - 1];
                        },
                    });
                }

                if (packageFolders.length > 1) {
                    prompts.push({
                        type: 'list',
                        name: 'package-folder',
                        message: 'Which folder?',
                        choices: packageFolders,
                    });
                }

                if (!this.options.type) {
                    prompts.push({
                        type: 'list',
                        name: 'type',
                        message: 'Which type of package?',
                        choices: [
                            {
                                name: 'Normal',
                                value: 'normal',
                            },
                            {
                                name: 'React',
                                value: 'react',
                            },
                        ],
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

                        if (answers.type) {
                            this.options.type = answers.type;
                        }

                        if (answers['package-folder']) {
                            this.options['package-folder'] = answers['package-folder'];
                        } else {
                            this.options['package-folder'] = get(packageFolders, 0, '');
                        }
                    });
            },
        };
    }

    get writing() {
        return {
            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.packagePath('.gitignore');
                this.fs.copy(srcPath, destPath);
            },

            babelrc() {
                const srcPath = this.templatePath('babelrc');
                const destPath = this.packagePath('.babelrc');
                this.fs.copy(srcPath, destPath);
            },

            npmrc() {
                const srcPath = this.templatePath('npmrc');
                const destPath = this.packagePath('.npmrc');
                this.fs.copy(srcPath, destPath);
            },

            packageJSON() {
                const { type } = this.options;
                const srcPath = this.templatePath('_package.json');
                const destPath = this.packagePath('package.json');
                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.name = this.options['package-name'];
                if (type === 'react') {
                    packageJSON.devDependencies = {
                        react: '>=15.0.0 || ^16.0.0',
                        'react-dom': '>=15.0.0 || ^16.0.0',
                    };
                    packageJSON.peerDependencies = {
                        react: '>=15.0.0 || ^16.0.0',
                        'react-dom': '>=15.0.0 || ^16.0.0',
                    };
                }
                const currentPackageJSON = this.fs.exists(destPath) ?
                    this.fs.readJSON(destPath) : {};
                this.fs.writeJSON(destPath, _.merge(packageJSON, currentPackageJSON));
            },

            webpackConfig() {
                const srcPath = this.templatePath('webpack.config.js');
                const destPath = this.packagePath('webpack.config.js');
                this.fs.copyTpl(srcPath, destPath, {
                    entryName: snakeCase(this.options['package-name']),
                    libraryName: pascalCase(this.options['package-name']),
                });
            },

            readme() {
                const srcPath = this.templatePath('Readme.md');
                const destPath = this.packagePath('Readme.md');
                this.fs.copy(srcPath, destPath);
            },

            src() {
                const { type } = this.options;
                const srcPath = this.templatePath(`src/${type}`);
                const destPath = this.packagePath('src');
                this.fs.copy(srcPath, destPath);
            },
        };
    }

    get install() {
        return {
            bootstrap() {
                if (this.options['skip-install']) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('lerna', ['bootstrap', '--hoist', '--scope', this.options['package-name']]).on('close', done);
            },
        };
    }
};
