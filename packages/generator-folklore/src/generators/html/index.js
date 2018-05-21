import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class HTMLGenerator extends Generator {
    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.option('path', {
            type: String,
            desc: 'Path for the html project',
            defaults: './',
        });

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });

        this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: './.tmp',
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

        this.option('css-path', {
            type: String,
            desc: 'Path for the css',
            defaults: 'css',
        });

        this.option('scss-path', {
            type: String,
            desc: 'Path for the scss',
            defaults: 'styles',
        });

        this.option('images-path', {
            type: String,
            desc: 'Path for the images',
            defaults: 'img',
        });

        this.option('build-path', {
            type: String,
            desc: 'Path for the build tools',
            defaults: 'build',
        });

        this.option('server', {
            type: Boolean,
            defaults: false,
            desc: 'Add a node.js server',
        });

        this.option('server-path', {
            type: String,
            desc: 'Path for the node.js server',
        });

        this.srcPath = filePath => this.destinationPath(path.join(this.options['src-path'], filePath));
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('HTML Generator');
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
        const projectName = _.get(this.options, 'project-name');
        const projectPath = this.destinationPath();
        const srcPath = _.get(this.options, 'src-path');
        const destPath = _.get(this.options, 'dest-path');
        const buildPath = _.get(this.options, 'build-path') || `${projectPath}/build`;
        const jsPath = _.get(this.options, 'js-path');
        const jsSrcPath = path.join(projectPath, srcPath, jsPath);
        const scssPath = _.get(this.options, 'scss-path');
        const scssSrcPath = path.join(projectPath, srcPath, scssPath);
        const skipInstall = _.get(this.options, 'skip-install', false);

        this.composeWith('folklore:js', {
            'project-name': projectName,
            'hot-reload': true,
            path: jsSrcPath,
            'skip-install': skipInstall,
            quiet: true,
        });

        this.composeWith('folklore:editorconfig', {
            quiet: true,
        });

        this.composeWith('folklore:scss', {
            'project-name': projectName,
            path: scssSrcPath,
            react: true,
            'skip-install': skipInstall,
            quiet: true,
        });

        if (this.options.server) {
            this.composeWith('folklore:server', {
                'project-name': projectName,
                path: _.get(this.options, 'server-path') || `${projectPath}/server`,
                'skip-install': skipInstall,
                quiet: true,
            });
        }

        this.composeWith('folklore:build', {
            path: buildPath,
            'src-path': srcPath,
            'entry-path': path.join(srcPath, 'index.js'),
            'html-path': path.join(srcPath, 'index.html.ejs'),
            'build-path': destPath,
            'empty-path': destPath,
            copy: true,
            'copy-path': path.join(srcPath, '*.{html,ico,txt,png}'),
            'skip-install': skipInstall,
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

            data() {
                const srcPath = this.templatePath('root.js');
                const destPath = this.srcPath('data/root.js');
                this.fs.copy(srcPath, destPath);
            },

            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.destinationPath('.gitignore');
                this.fs.copy(srcPath, destPath);
            },
        };
    }
};
