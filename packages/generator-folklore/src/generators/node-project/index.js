import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';
import { ensureLeadingDotSlash } from '../../lib/utils';

module.exports = class NodeProjectGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });

        this.option('dest-path', {
            type: String,
            desc: 'Path for build',
            defaults: './dist',
        });

        this.option('html-path', {
            type: String,
            desc: 'Path for the HTML',
            defaults: './web',
        });

        this.option('server-path', {
            type: String,
            desc: 'Path for the server',
            defaults: '',
        });

        this.option('cli-path', {
            type: String,
            desc: 'Path for the cli',
            defaults: '',
        });

        this.srcPath = (filePath) =>
            this.destinationPath(path.join(this.options['src-path'], filePath));
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Node Project Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts).then((answers) => {
                    if (answers['project-name']) {
                        this.options['project-name'] = answers['project-name'];
                    }
                });
            },
        };
    }

    configuring() {
        const {
            'project-name': projectName,
            'src-path': srcPath,
            'dest-path': destPath,
            'html-path': htmlPath,
            'server-path': serverPath,
            'cli-path': cliPath,
        } = this.options;
        const htmlSrcPath = path.join(srcPath, htmlPath);
        const serverSrcPath = path.join(srcPath, serverPath);
        const cliSrcPath = path.join(srcPath, cliPath);

        this.composeWith('folklore:html-project', {
            'skip-install': true,
            quiet: true,
            'project-name': projectName,
            'src-path': htmlSrcPath,
            'dest-path': destPath,
        });

        this.composeWith('folklore:server', {
            'skip-install': true,
            quiet: true,
            path: serverSrcPath,
        });

        this.composeWith('folklore:cli', {
            'skip-install': true,
            quiet: true,
            path: cliSrcPath,
        });

        this.composeWith('folklore:rollup', {
            'skip-install': true,
            quiet: true,
        });
    }

    get writing() {
        return {
            index() {
                this.fs.copyTpl(this.templatePath('index.js'), this.srcPath('index.js'));
            },

            packageJson() {
                const {
                    'src-path': srcPath,
                    'html-path': htmlPath,
                    'server-path': serverPath,
                } = this.options;
                const webEntryPath = path.join(srcPath, htmlPath, 'index.js');
                const serverEntryPath = path.join(srcPath, serverPath, 'server.js');

                const scripts = {
                    'build:web': `flklr build --load-env ${ensureLeadingDotSlash(webEntryPath)}`,
                    'build:rollup': `rollup --config rollup.config.js`,
                    'build': 'npm run build:web && npm run build:rollup',
                    'server': `babel-node ${ensureLeadingDotSlash(serverEntryPath)}`,
                    'start': `flklr serve --load-env ${ensureLeadingDotSlash(webEntryPath)}`,
                };

                this.packageJson.merge({
                    scripts,
                });
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
