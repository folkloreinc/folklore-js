import chalk from 'chalk';

import Generator from '../../lib/generator';

const launchArgs = {
    laravel: ['run', 'server', '--', '--no-open'],
    html: ['run', 'server', '--', '--server', 'http', '--no-open'],
};

const defaultUrls = {
    laravel: 'https://localhost:8080',
    html: 'http://localhost:8080',
};

export default class ClaudeGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('type', {
            type: String,
            desc: 'Project type: laravel (served through its .test domain) or html (served on localhost)',
            defaults: 'html',
        });

        this.option('url', {
            type: String,
            desc: 'Url opened by the browser preview (defaults to the dev server url)',
        });
    }

    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('Claude Code Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    writing() {
        const type = this.options.type === 'laravel' ? 'laravel' : 'html';
        const url = (this.options.url || defaultUrls[type]).replace(/\/$/, '');

        this.fs.writeJSON(
            this.destinationPath('.claude/launch.json'),
            {
                version: '0.0.1',
                configurations: [
                    {
                        name: 'dev',
                        runtimeExecutable: 'npm',
                        runtimeArgs: launchArgs[type],
                        port: 8080,
                        url,
                    },
                ],
            },
            null,
            4,
        );

        this.fs.copy(
            this.templatePath(`settings-${type}.json`),
            this.destinationPath('.claude/settings.json'),
        );
    }
}
