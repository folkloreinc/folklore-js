import _ from 'lodash';
import remote from 'yeoman-remote';
import glob from 'glob';
import path from 'path';
import chalk from 'chalk';
import generatePassword from 'password-generator';
import Generator from '../../lib/generator';

module.exports = class LaravelGenerator extends Generator {

    static safeDbString(str) {
        return str.replace(/[-s.]+/gi, '_')
            .replace(/[^a-z0-9]+/gi, '');
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

        this.option('laravel_branch', {
            type: String,
            desc: 'Laravel repository branch',
            defaults: '5.5',
        });

        this.option('url', {
            type: String,
            desc: 'Project url',
            defaults: 'http://<%= project_host %>',
        });

        this.option('local-url', {
            type: String,
            desc: 'Project local url',
            defaults: 'http://<%= project_host %>.local.flklr.ca',
        });

        this.option('proxy-url', {
            type: String,
            desc: 'Project proxy url',
            defaults: 'http://<%= project_host %>.homestead.flklr.ca',
        });

        this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: '.tmp',
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

        this.option('build-path', {
            type: String,
            desc: 'Path for the build tools',
            defaults: 'build',
        });

        this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: 'js',
        });

        this.option('scss-path', {
            type: String,
            desc: 'Path for the scss',
            defaults: 'scss',
        });

        this.option('css-path', {
            type: String,
            desc: 'Path for the css',
            defaults: 'css',
        });

        this.option('images-path', {
            type: String,
            desc: 'Path for the images',
            defaults: 'img',
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

        this.option('hot-reload', {
            type: Boolean,
            desc: 'Enable hot reload',
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
                            const projectName = (this.options['project-name'] || answers['project-name']);
                            return projectName.match(/.[^.]+$/) ? projectName : `${projectName}.com`;
                        },
                    });
                }

                if (!this.options['db-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'db-name',
                        message: 'What is the name of the database?',
                        default: (answers) => {
                            const projectName = (this.options['project-name'] || answers['project-name']);
                            return (projectName.match(/^([^.]+)/))[1];
                        },
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers['project-name']) {
                            this.options['project-name'] = answers['project-name'];
                        }
                        if (answers['project-host']) {
                            this.options['project-host'] = answers['project-host'];
                        }
                        if (answers['db-name']) {
                            this.options['db-name'] = answers['db-name'];
                        }
                    });
            },
        };
    }

    configuring() {
        const assetsPath = _.get(this.options, 'assets-path', '').replace(/\/$/, '');
        const tmpPath = _.get(this.options, 'tmp-path', '').replace(/\/$/, '');
        const publicPath = _.get(this.options, 'public-path');
        const buildPath = _.get(this.options, 'build-path');
        const jsPath = _.get(this.options, 'js-path');
        const jsSrcPath = path.join(assetsPath, jsPath);
        const scssPath = _.get(this.options, 'scss-path');
        const scssSrcPath = path.join(assetsPath, scssPath);
        const cssPath = _.get(this.options, 'css-path');
        const imagesPath = _.get(this.options, 'images-path');
        const skipInstall = _.get(this.options, 'skip-install', false);
        const urlLocal = _.template(_.get(this.options, 'local-url'))({
            project_host: this.options['project-host'],
            project_name: this.options['project-name'],
        }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');
        const urlProxy = _.template(_.get(this.options, 'proxy-url', _.get(this.options, 'local-url')))({
            project_host: this.options['project-host'],
            project_name: this.options['project-name'],
        }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

        this.composeWith('folklore:js', {
            'project-name': this.options['project-name'],
            path: jsSrcPath,
            'skip-install': skipInstall,
            'hot-reload': this.options['hot-reload'],
            quiet: true,
        });

        this.composeWith('folklore:editorconfig', {
            quiet: true,
        });

        this.composeWith('folklore:scss', {
            'project-name': this.options['project-name'],
            path: scssSrcPath,
            quiet: true,
        });

        this.composeWith('folklore:build', {
            'project-name': this.options['project-name'],
            path: buildPath,
            'tmp-path': tmpPath,
            'src-path': assetsPath,
            'dest-path': publicPath,
            'webpack-public-path': `/${jsPath.replace(/\/$/, '')}/`,
            'js-path': jsPath,
            'scss-path': scssPath,
            'css-path': cssPath,
            'images-path': imagesPath,
            'webpack-entries': {
                main: './index',
                config: './config',
                vendor: ['lodash'],
            },
            'hot-reload': this.options['hot-reload'],
            'browsersync-base-dir': [
                tmpPath,
                publicPath,
            ],
            'browsersync-host': urlLocal.replace(/^https?:\/\//, ''),
            'browsersync-proxy': urlProxy,
            'browsersync-files': [
                'config/**/*.php',
                'app/**/*.php',
                'routes/*.php',
                'resources/lang/**/*.php',
                'resources/views/**/*.php',
                path.join(tmpPath, 'css/*.css'),
                path.join(publicPath, '*.html'),
                path.join(publicPath, '**/*.{jpg,png,ico,gif}'),
            ],
            'skip-install': skipInstall,
            quiet: true,
        });
    }

    get writing() {
        return {
            laravel() {
                const done = this.async();

                remote('laravel', 'laravel', this.options.laravel_branch, (err, cachePath) => {
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
                    'app/Providers/AppServiceProvider.php',
                    'resources/assets/sass',
                    'resources/assets/js',
                    'resources/assets/js/app.js',
                    'resources/assets/js/bootstrap.js',
                    'resources/views/welcome.blade.php',
                ];

                files.forEach((file) => {
                    const filePath = this.destinationPath(file);
                    this.fs.delete(filePath);
                });
            },

            packageJSON() {
                const jsonPath = this.destinationPath('package.json');
                const packageJSON = this.fs.exists(jsonPath) ? this.fs.readJSON(jsonPath) : {};
                packageJSON.scripts = {};
                packageJSON.devDependencies = {};
                this.fs.writeJSON(jsonPath, packageJSON);
            },

            composerJSON() {
                const src = this.destinationPath('composer.json');
                this.fs.extendJSON(src, {
                    require: {
                        'folklore/image': 'v1.x-dev',
                        'folklore/laravel-locale': '^2.2',
                        'folklore/laravel-hypernova': '^0.1',
                        'barryvdh/laravel-debugbar': '^2.3',
                    },
                });
            },

            env() {
                const url = _.template(_.get(this.options, 'local-url'))({
                    project_host: this.options['project-host'],
                    project_name: this.options['project-name'],
                }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

                const urlLocal = _.template(_.get(this.options, 'local-url'))({
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
                };

                const src = this.templatePath('env');
                const dest = this.destinationPath('.env');
                this.fs.copyTpl(src, dest, templateData);

                const srcExample = this.templatePath('env');
                const destExample = this.destinationPath('.env.example');
                this.fs.copyTpl(srcExample, destExample, templateData);

                const srcProd = this.templatePath('env.prod');
                const destProd = this.destinationPath('.env.prod');
                templateData.url = url;
                templateData.db_username = this.options['db-name'];
                this.fs.copyTpl(srcProd, destProd, templateData);
            },

            phpcs() {
                const srcPath = this.templatePath('phpcs.xml');
                const destPath = this.destinationPath('phpcs.xml');
                this.fs.copy(srcPath, destPath);
            },

            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.destinationPath('.gitignore');
                if (this.fs.exists(destPath)) {
                    this.fs.delete(destPath);
                }
                this.fs.copy(srcPath, destPath);
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
                    if (file.match(/\.(jpg|jpeg|gif|png)$/i)) {
                        this.fs.copy(source, destination);
                    } else {
                        this.fs.copyTpl(source, destination, {
                            project_name: this.options['project-name'],
                        });
                    }
                });
            },
        };
    }

    get install() {
        return {
            composer() {
                const skipInstall = _.get(this.options, 'skip-install', false);
                if (skipInstall) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('composer', ['install']).on('close', done);
            },

            permissions() {
                this.spawnCommand('chmod', ['-R', '777', 'storage']);
                this.spawnCommand('chmod', ['-R', '777', 'public/files']);
            },

            keyGenerate() {
                const skipInstall = _.get(this.options, 'skip-install', false);
                if (skipInstall) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('php', ['artisan', 'key:generate']).on('close', done);
            },

            vendorPublish() {
                const skipInstall = _.get(this.options, 'skip-install', false);
                if (skipInstall) {
                    return;
                }

                const done = this.async();
                this.spawnCommand('php', ['artisan', 'vendor:publish']).on('close', done);
            },
        };
    }

};
