import chalk from 'chalk';

import Generator from '../../lib/generator';

module.exports = class EslintGenerator extends Generator {
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
            eslintrc() {
                const srcPath = this.templatePath('eslintrc');
                const destPath = this.destinationPath('.eslintrc');
                this.fs.copy(srcPath, destPath);
            },

            eslintignore() {
                const srcPath = this.templatePath('eslintignore');
                const destPath = this.destinationPath('.eslintignore');
                this.fs.copy(srcPath, destPath);
            },

            dependencies() {
                this.addDevDependencies({
                    'babel-preset-airbnb': 'latest',
                    '@babel/eslint-parser': 'latest',
                    eslint: '^8.0.0',
                    'eslint-config-airbnb': 'latest',
                    'eslint-config-prettier': 'latest',
                    'eslint-plugin-prettier': 'latest',
                    'eslint-plugin-import': 'latest',
                    'eslint-plugin-jsx-a11y': 'latest',
                    'eslint-plugin-react': 'latest',
                    'eslint-plugin-formatjs': 'latest',
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
