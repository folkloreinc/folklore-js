import chalk from 'chalk';

import Generator from '../../lib/generator';

export default class TypescriptGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });

        this.option('skip-install', {
            type: Boolean,
            required: false,
            defaults: false,
        });
    }

    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('Typescript Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    get writing() {
        return {
            tsconfig() {
                const srcPath = this.templatePath('_tsconfig.json');
                const destPath = this.destinationPath('tsconfig.json');
                this.fs.copyTpl(srcPath, destPath, {
                    srcPath: this.options['src-path'],
                });
            },

            dependencies() {
                this.addDevDependencies({
                    '@tsconfig/create-react-app': '^2.0.9',
                    '@types/facebook-js-sdk': '^3.3.12',
                    '@types/jest': '^30.0.0',
                    '@types/json-stable-stringify': '^1.2.0',
                    '@types/lodash': '^4.17.24',
                    '@types/lodash-es': '^4.17.12',
                    '@types/minimatch': '^6.0.0',
                    '@types/node': '^25.0.3',
                    '@types/react': '^19.2.7',
                    '@types/react-dom': '^19.2.3',
                    'typescript-plugin-css-modules': '^5.2.0',
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
}
