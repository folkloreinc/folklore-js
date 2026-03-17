import chalk from 'chalk';

import Generator from '../../lib/generator';

export default class EslintGenerator extends Generator {
    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('Eslint Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    get writing() {
        return {
            eslintConfig() {
                const srcPath = this.templatePath('.eslint.config.js');
                const destPath = this.destinationPath('eslint.config.js');
                this.fs.copy(srcPath, destPath);
            },

            dependencies() {
                this.addDevDependencies({
                    '@babel/eslint-parser': '^7.18.9',
                    '@babel/preset-typescript': '^7.26.0',
                    '@eslint-react/eslint-plugin': '^2.0.0',
                    eslint: '^9.36.0',
                    'eslint-config-prettier': '^10.1.8',
                    'eslint-plugin-formatjs': '^5.4.0',
                    'eslint-plugin-import': '^2.32.0',
                    'eslint-plugin-prettier': '^5.5.4',
                    typescript: '^5.7.3',
                    'typescript-eslint': '^8.25.0',
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
