import chalk from 'chalk';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class IntlGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('translations-path', {
            type: String,
            desc: 'Path for to search for translations',
            defaults: './src/**/*.{js,jsx}',
        });

        this.option('locales', {
            type: String,
            desc: 'Supported locales',
            defaults: 'fr,en',
        });

        this.option('output-path', {
            type: String,
            desc: 'Path to output locale files',
            defaults: './locale',
        });

        this.option('json-path', {
            type: String,
            desc: 'Path to copy json files',
        });

        this.option('without-id-only', {
            type: String,
            desc: 'Extract only messages without id',
            defaults: false,
        })
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Intl Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            packageJSON() {
                const {
                    'translations-path': translationsPath = null,
                    'output-path': outputPath = null,
                    'json-path': jsonPath = null,
                    'without-id-only': withoutIdOnly = false,
                    locales,
                } = this.options;
                const intlCommand = `flklr intl --po${withoutIdOnly ? ' --without-id-only' : ''} --output-path$ '${outputPath}' '${translationsPath}'`;
                this.packageJson.merge({
                    scripts:
                        jsonPath !== null
                            ? {
                                  intl: 'npm run intl:build && npm run intl:copy',
                                  'intl:build': intlCommand,
                                  'intl:copy': `cp ${path.join(outputPath, '*.json')} ${jsonPath}`,
                              }
                            : {
                                  intl: intlCommand,
                              },
                    supportedLocales: locales.split(','),
                });
            },

            dependencies() {
                this.addDevDependencies(['@folklore/cli@^0.0.47']);
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
