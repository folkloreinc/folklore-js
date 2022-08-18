import chalk from 'chalk';
import glob from 'glob';
import _ from 'lodash';
import generatePassword from 'password-generator';
import path from 'path';
import remote from 'yeoman-remote';

import Generator from '../../lib/generator';

module.exports = class LaravelProjectGenerator extends Generator {
    static safeDbString(str) {
        return str.replace(/[-s.]+/gi, '_').replace(/[^a-z0-9]+/gi, '');
    }

    static getPassword() {
        return generatePassword(20, false);
    }

    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.argument('project-host', {
            type: String,
            required: false,
        });

        this.option('laravel-version', {
            type: String,
            desc: 'Laravel version',
            defaults: 'latest',
        });

        this.option('laravel-branch', {
            type: String,
            desc: 'Laravel repository branch',
        });

        this.option('url', {
            type: String,
            desc: 'Project url',
            defaults: 'https://<%= project_host %>',
        });

        this.option('local-url', {
            type: String,
            desc: 'Project local url',
            defaults: 'https://<%= project_host %>.test:8080',
        });

        this.option('proxy-url', {
            type: String,
            desc: 'Project proxy url',
            defaults: 'https://<%= project_host %>.test',
        });

        this.option('assets-path', {
            type: String,
            desc: 'Path for assets',
            defaults: 'resources/assets',
        });

        this.option('public-path', {
            type: String,
            desc: 'Path for build',
            defaults: 'public',
        });

        this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: 'js',
        });

        this.option('styles-path', {
            type: String,
            desc: 'Path for the styles',
            defaults: 'styles',
        });

        this.option('db-host', {
            type: String,
            desc: 'Database host',
            defaults: 'localhost',
        });

        this.option('db-username', {
            type: String,
            desc: 'Database username',
            defaults: 'homestead',
        });

        this.option('db-password', {
            type: String,
            desc: 'Database password',
            defaults: 'secret',
        });

        this.option('db-name', {
            type: String,
            desc: 'Database name',
        });

        this.option('panneau', {
            type: Boolean,
            desc: 'Add panneau',
            defaults: false,
        });

        this.option('auth', {
            type: Boolean,
            desc: 'Add auth',
            defaults: false,
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Laravel Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!this.options['project-host']) {
                    prompts.push({
                        type: 'input',
                        name: 'project-host',
                        message: 'What is the host of the project?',
                        default: (answers) => {
                            const projectName =
                                this.options['project-name'] || answers['project-name'];
                            return projectName.match(/.[^.]+$/)
                                ? projectName
                                : `${projectName}.com`;
                        },
                    });
                }

                if (!this.options['db-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'db-name',
                        message: 'What is the name of the database?',
                        default: (answers) => {
                            const projectName =
                                this.options['project-name'] || answers['project-name'];
                            return projectName.match(/^([^.]+)/)[1];
                        },
                    });
                }

                const featuresChoices = [
                    !this.options.panneau && {
                        name: 'Panneau',
                        value: 'panneau',
                        checked: true,
                    },
                    !this.options.auth && {
                        name: 'Auth',
                        value: 'auth',
                        checked: true,
                    },
                ].filter(Boolean);
                if (featuresChoices.length) {
                    prompts.push({
                        type: 'checkbox',
                        name: 'features',
                        choices: featuresChoices,
                        message: 'Which features?',
                        default: featuresChoices
                            .filter((it) => it.checked || false)
                            .map((it) => it.name),
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts).then((answers) => {
                    if (answers['project-name']) {
                        this.options['project-name'] = answers['project-name'];
                    }
                    if (answers['project-host']) {
                        this.options['project-host'] = answers['project-host'];
                    }
                    if (answers['db-name']) {
                        this.options['db-name'] = answers['db-name'];
                    }

                    const features = answers.features || [];
                    if (features.indexOf('panneau') !== -1) {
                        this.options.panneau = true;
                    }
                    if (features.indexOf('auth') !== -1) {
                        this.options.auth = true;
                    }
                });
            },
        };
    }

    configuring() {
        const assetsPath = _.get(this.options, 'assets-path', '').replace(/\/$/, '');
        const publicPath = _.get(this.options, 'public-path');
        const jsPath = _.get(this.options, 'js-path');
        const jsSrcPath = path.join(assetsPath, jsPath);
        const stylesPath = _.get(this.options, 'styles-path');
        const stylesSrcPath = path.join(assetsPath, stylesPath);

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

        this.composeWith('folklore:browserslist', {
            'skip-install': true,
            quiet: true,
        });

        this.composeWith('folklore:editorconfig', {
            quiet: true,
            'skip-install': true,
        });

        this.composeWith('folklore:react-app', {
            'project-name': this.options['project-name'],
            path: jsSrcPath,
            'styles-path': stylesSrcPath,
            quiet: true,
            'skip-install': true,
        });

        this.composeWith('folklore:scss', {
            'project-name': this.options['project-name'],
            path: stylesSrcPath,
            react: true,
            quiet: true,
            'skip-install': true,
        });

        this.composeWith('folklore:build', {
            'src-path': assetsPath,
            'entry-path': path.join(jsSrcPath, 'index.js'),
            'build-path': publicPath,
            'empty-path': destPath,
            quiet: true,
            'skip-install': true,
        });

        // if (this.options.panneau) {
        //     this.composeWith('folklore:laravel-panneau', {
        //         'project-name': this.options['project-name'],
        //         'js-path': jsSrcPath,
        //         'styles-path': stylesSrcPath,
        //         'skip-install': skipInstall,
        //         'install-npm': true,
        //         quiet: true,
        //     });
        // }

        // if (this.options.auth) {
        //     this.composeWith('folklore:laravel-auth', {
        //         'project-name': this.options['project-name'],
        //         'js-path': jsSrcPath,
        //         'styles-path': stylesSrcPath,
        //         'skip-install': skipInstall,
        //         'install-npm': true,
        //         quiet: true,
        //     });
        // }
    }

    get writing() {
        return {
            laravel() {
                const done = this.async();

                const versionBranch =
                    this.options['laravel-version'] === 'latest'
                        ? 'master'
                        : this.options['laravel-version'];
                const branch = this.options['laravel-branch'] || versionBranch;

                remote('laravel', 'laravel', branch, (err, cachePath) => {
                    const destinationPath = this.destinationPath();
                    const files = glob.sync('**', {
                        dot: true,
                        nodir: true,
                        cwd: cachePath,
                    });

                    let source;
                    let destination;
                    files.forEach((file) => {
                        source = path.join(cachePath, file);
                        destination = path.join(destinationPath, file);
                        if (!this.fs.exists(destination)) {
                            this.fs.copy(source, destination);
                        }
                    });

                    done();
                });
            },

            removeFiles() {
                const files = [
                    'gulpfile.js',
                    'package.json',
                    'webpack.mix.js',
                    'config/app.php',
                    'routes/web.php',
                    'public/css/app.css',
                    'public/js/app.js',
                    'app/Exceptions/Handler.php',
                    'app/Providers/AppServiceProvider.php',
                    'resources/sass/**',
                    'resources/js/**',
                    'resources/sass',
                    'resources/js',
                    'resources/assets/sass/**',
                    'resources/assets/js/**',
                    'resources/assets/sass',
                    'resources/assets/js',
                    'resources/views/welcome.blade.php',
                    'resources/views/errors/404.blade.php',
                    'resources/views/errors/500.blade.php',
                ];

                files.forEach((file) => {
                    const filePath = this.destinationPath(file);
                    this.fs.delete(filePath);
                });
            },

            composerJSON() {
                this.composerJson.merge({
                    require: {
                        'folklore/laravel-folklore': 'v1.x-dev',
                        'folklore/laravel-locale': 'v8.x-dev',
                        'folklore/laravel-panneau': 'v1.2.x-dev',
                    },
                });
            },

            env() {
                const url = _.template(_.get(this.options, 'url'))({
                    project_host: this.options['project-host'],
                    project_name: this.options['project-name'],
                }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

                const urlLocal = _.template(_.get(this.options, 'local-url'))({
                    project_host: this.options['project-host'],
                    project_name: this.options['project-name'],
                }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

                const urlProxy = _.template(
                    _.get(this.options, 'proxy-url', _.get(this.options, 'local-url')),
                )({
                    project_host: this.options['project-host'],
                    project_name: this.options['project-name'],
                }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

                const templateData = {
                    project_name: this.options['project-name'],
                    db_host: this.options['db-host'],
                    db_username: this.options['db-username'],
                    db_password: this.options['db-password'],
                    db_name: this.options['db-name'],
                    url: urlLocal,
                    proxy_url: urlProxy,
                };

                const prodTemplateData = {
                    ...templateData,
                    url,
                    db_username: this.options['db-name'],
                };

                const src = this.templatePath('env');
                const dest = this.destinationPath('.env');
                this.fs.copyTpl(src, dest, templateData);

                const srcExample = this.templatePath('env');
                const destExample = this.destinationPath('.env.example');
                this.fs.copyTpl(srcExample, destExample, templateData);

                // const srcProd = this.templatePath('env.prod');
                // const destProd = this.destinationPath('.env.prod');
                // this.fs.copyTpl(srcProd, destProd, prodTemplateData);
            },

            files() {
                const templatePath = this.templatePath('laravel');
                const destinationPath = this.destinationPath();
                const files = glob.sync('**', {
                    dot: true,
                    nodir: true,
                    cwd: templatePath,
                });

                files.forEach((file) => {
                    const source = path.join(templatePath, file);
                    const destination = path.join(destinationPath, file);
                    if (file.match(/\.php$/i)) {
                        this.fs.copyTpl(source, destination, {
                            options: this.options,
                        });
                    } else {
                        this.fs.copy(source, destination);
                    }
                });
            },
        };
    }

    get install() {
        return {
            async npm() {
                if (this.options['skip-install']) {
                    return;
                }

                await this.spawnCommand('npm', ['install']);
            },

            async composer() {
                if (this.options['skip-install']) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('composer', ['install']).on('close', done);
            },

            async keyGenerate() {
                if (this.options['skip-install']) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('php', ['artisan', 'key:generate']).on('close', done);
            },

            async vendorPublish() {
                if (this.options['skip-install']) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('php', ['artisan', 'vendor:publish', '--all']).on('close', done);
            },
        };
    }
};
