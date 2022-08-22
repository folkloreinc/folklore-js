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
            defaults: '9',
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

        this.option('mediatheque', {
            type: Boolean,
            desc: 'Add mediatheque',
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
                    !this.options.mediatheque && {
                        name: 'Mediatheque',
                        value: 'mediatheque',
                        checked: true,
                    },
                    !this.options.panneau && {
                        name: 'Panneau',
                        value: 'panneau',
                        checked: false,
                    },
                    !this.options.auth && {
                        name: 'Auth',
                        value: 'auth',
                        checked: false,
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
                    if (features.indexOf('mediatheque') !== -1) {
                        this.options.mediatheque = true;
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
            quiet: true,
            'skip-install': true,
        });

        this.composeWith('folklore:intl', {
            'translations-path': path.join(jsSrcPath, '**/*.{js,jsx}'),
            'output-path': './lang',
            'without-id-only': true,
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
                const {
                    'laravel-version': laravelVersion = null,
                    'laravel-branch': laravelBranch = null,
                } = this.options;
                const versionBranch =
                    laravelVersion !== 'latest' && laravelVersion !== null
                        ? `${
                              laravelVersion.indexOf('.') !== -1
                                  ? laravelVersion
                                  : `${laravelVersion}.x`
                          }`
                        : null;
                const branch = laravelBranch || versionBranch;

                const remoteCallback = (err, cachePath) => {
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
                };

                if (branch !== null) {
                    remote('laravel', 'laravel', branch, remoteCallback);
                } else {
                    remote('laravel', 'laravel', remoteCallback);
                }
            },

            removeFiles() {
                const files = [
                    'package.json',
                    'config/app.php',
                    'routes/web.php',
                    'vite.config.js',
                    'resources/css',
                    'resources/js',
                    'resources/views/welcome.blade.php',
                    'app/Http/Controllers/HomeController.php',
                    'app/Http/Middleware/TrustProxies.php',
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
                        'folklore/laravel-image': 'v1.x-dev',
                    },
                });

                if (this.options.mediatheque) {
                    this.composerJson.merge({
                        require: {
                            'folklore/laravel-mediatheque': 'v1.1.x-dev',
                        },
                    });
                }

                if (this.options.panneau) {
                    this.composerJson.merge({
                        require: {
                            'folklore/laravel-mediatheque': 'v1.1.x-dev',
                            'folklore/laravel-panneau': 'v1.2.x-dev',
                        },
                    });
                }
            },

            packageJSON() {
                this.packageJson.merge({
                    scripts: {
                        clean: 'rm -rf public/static && rm -rf public/precache-*',
                        'build:scripts': 'flklr build --load-env ./resources/assets/js/index.js',
                        'build:views': 'php artisan assets:view',
                        build: 'npm run clean && npm run build:scripts && npm run build:views',
                        start: 'npm run server',
                        server: 'flklr serve --load-env ./resources/assets/js/index.js',
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

                await this.spawnCommand('composer', ['install']);
            },

            async keyGenerate() {
                if (this.options['skip-install']) {
                    return;
                }

                await this.spawnCommand('php', ['artisan', 'key:generate']);
            },

            async valet() {
                if (this.options['skip-install']) {
                    return;
                }

                await this.spawnCommand('valet', [
                    'link',
                    '--secure',
                    this.options['project-host'],
                ]);
            },
        };
    }
};
