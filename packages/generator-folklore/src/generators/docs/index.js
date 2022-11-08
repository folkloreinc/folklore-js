import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class DocsGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('docs-path', {
            type: String,
            required: false,
            defaults: './docs',
        });

        this.option('language', {
            type: String,
            required: false,
        });

        this.docsPath = (destPath) =>
            this.destinationPath(path.join(this.options['docs-path'], destPath || ''));
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Eslint Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options.language) {
                    prompts.push({
                        type: 'list',
                        name: 'type',
                        message: 'What language is used?',
                        defaults: () =>
                            this.fs.exists(this.destinationPath('composer.json')) ? 'php' : 'js',
                        choices: [
                            {
                                name: 'Javascript',
                                value: 'js',
                            },
                            {
                                name: 'PHP',
                                value: 'php',
                            },
                        ],
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts).then((answers) => {
                    if (answers.language) {
                        this.language = answers.language;
                    }
                });
            },
        };
    }

    get writing() {
        return {
            bookJSON() {
                const srcPath = this.templatePath('book.json');
                const destPath = this.destinationPath('book.json');
                this.fs.copy(srcPath, destPath);
            },

            jsdocJSON() {
                if (this.options.language !== 'js') {
                    return;
                }
                const srcPath = this.templatePath('jsdoc.json');
                const destPath = this.destinationPath('jsdoc.json');
                this.fs.copy(srcPath, destPath);
            },

            phpdoc() {
                if (this.options.language !== 'php') {
                    return;
                }
                const srcPath = this.templatePath('phpdoc.xml');
                const destPath = this.destinationPath('phpdoc.xml');
                this.fs.copy(srcPath, destPath);
            },

            docs() {
                const srcPath = this.templatePath('docs');
                const destPath = this.docsPath();
                this.fs.copy(srcPath, destPath);
            },

            generateApiDoc() {
                const srcPath = this.templatePath(`generate_api_doc.${this.options.language}`);
                const destPath = this.destinationPath(this.docsPath('scripts/generate_api_doc'));
                this.fs.copy(srcPath, destPath);
            },

            packageJSON() {
                const generateApiPath = path.relative(
                    this.destinationPath(),
                    this.destinationPath(this.docsPath('./scripts/generate_api_doc')),
                );
                const scripts = {
                    'docs:prepare': 'gitbook install',
                    'docs:api': `phpdoc && ${generateApiPath}`,
                    'docs:serve': 'npm run docs:prepare && npm run docs:api && gitbook serve',
                    'build:docs': 'npm run docs:prepare && npm run docs:api',
                };

                const packageJSON = this.fs.exists(destPath) ? this.fs.readJSON(destPath) : {};
                packageJSON.scripts = {
                    ...packageJSON.scripts,
                    ...scripts,
                };
                this.packageJson.merge(packageJSON);
            },
        };
    }

    get install() {
        return {
            npm() {
                if (this.options['skip-install']) {
                    return;
                }

                this.addDevDependencies({ 'gitbook-cli': 'latest' });

                if (this.options.language === 'js') {
                    this.addDevDependencies({ jsdoc: 'latest', 'jsdoc-babel': 'latest' });
                }
            },
        };
    }
};
