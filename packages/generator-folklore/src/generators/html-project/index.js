import chalk from 'chalk';
import _ from 'lodash';
import path from 'path';

import Generator from '../../lib/generator';

module.exports = class HTMLProjectGenerator extends Generator {
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

        this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: '',
        });

        this.option('styles-path', {
            type: String,
            desc: 'Path for the scss',
            defaults: 'styles',
        });

        this.option('server', {
            type: Boolean,
            defaults: false,
            desc: 'Add a node.js server',
        });

        this.option('server-path', {
            type: String,
            desc: 'Path for the node.js server',
            defaults: '',
        });

        this.option('server-filename', {
            type: String,
            desc: 'Filename for the node.js server',
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
                console.log('HTML Project Generator');
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
            'js-path': jsPath,
            'styles-path': stylesPath,
            'server-path': serverPath,
            'server-filename': serverFilename,
        } = this.options;
        const jsSrcPath = path.join(srcPath, jsPath);
        const stylesSrcPath = path.join(srcPath, stylesPath);
        const serverSrcPath = path.join(srcPath, serverPath);

        this.composeWith('folklore:prettier', {
            'skip-install': true,
            quiet: true,
        });

        this.composeWith('folklore:eslint', {
            'skip-install': true,
            quiet: true,
        });

        this.composeWith('folklore:stylelint', {
            'skip-install': true,
            quiet: true,
        });

        this.composeWith('folklore:svgo', {
            quiet: true,
            'skip-install': true,
        });

        this.composeWith('folklore:browserslist', {
            'skip-install': true,
            quiet: true,
        });

        this.composeWith('folklore:editorconfig', {
            quiet: true,
        });

        this.composeWith('folklore:react-app', {
            'project-name': projectName,
            path: jsSrcPath,
            stylesPath: stylesSrcPath,
            'skip-install': true,
            quiet: true,
        });

        this.composeWith('folklore:scss', {
            'project-name': projectName,
            path: stylesSrcPath,
            react: true,
            'skip-install': true,
            quiet: true,
        });

        if (this.options.server) {
            this.composeWith('folklore:server', {
                path: serverSrcPath,
                filename: serverFilename,
                'skip-install': true,
                quiet: true,
            });
        }

        console.log(srcPath, jsSrcPath, path.join(jsSrcPath, 'index.js'), path.join(srcPath, 'index.html.ejs'));

        this.composeWith('folklore:build', {
            'src-path': srcPath,
            'entry-path': path.join(jsSrcPath, 'index.js'),
            'html-path': path.join(srcPath, 'index.html.ejs'),
            'build-path': destPath,
            'empty-path': destPath,
            copy: true,
            'copy-path': path.join(srcPath, '*.{html,ico,txt,png}'),
            'skip-install': true,
            quiet: true,
        });
    }

    get writing() {
        return {
            html() {
                const projectName = _.get(this.options, 'project-name');
                const jsPath = _.get(this.options, 'js-path', 'js').replace(/^\/?/, '/');
                const cssPath = _.get(this.options, 'css-path', 'css').replace(/^\/?/, '/');

                const srcPath = this.templatePath('index.html.ejs');
                const destPath = this.srcPath('index.html.ejs');
                this.fs.copyTpl(srcPath, destPath, {
                    title: projectName || 'Prototype',
                    jsPath,
                    cssPath,
                });
            },

            img() {
                const srcPath = this.templatePath('folklore.png');
                const destPath = this.srcPath('img/folklore.png');
                this.fs.copy(srcPath, destPath);
            },

            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.destinationPath('.gitignore');
                this.fs.copy(srcPath, destPath);
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
