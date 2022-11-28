import chalk from 'chalk';

import Generator from '../../lib/generator';

module.exports = class AppGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.argument('type', {
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
                console.log('FOLKLORE Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!this.options.type) {
                    prompts.push({
                        type: 'list',
                        name: 'type',
                        message: 'What type of project?',
                        choices: [
                            {
                                name: 'HTML',
                                value: 'html-project',
                            },
                            {
                                name: 'Laravel',
                                value: 'laravel-project',
                            },
                            {
                                name: 'Node',
                                value: 'node-project',
                            },
                        ],
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts).then((answers) => {
                    if (answers.type) {
                        this.options.type = answers.type;
                    }

                    if (answers['project-name']) {
                        this.options['project-name'] = answers['project-name'];
                    }
                });
            },
        };
    }

    configuring() {
        const composeWith = `folklore:${this.options.type}`;
        this.composeWith(composeWith, {
            ...this.options,
        });
    }
};
