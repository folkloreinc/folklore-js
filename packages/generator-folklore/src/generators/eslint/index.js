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
                    'babel-preset-airbnb': '^5.0.0',
                    '@babel/eslint-parser': '^7.18.9',
                    eslint: '^8.0.0',
                    'eslint-config-airbnb': '^19.0.4',
                    'eslint-config-prettier': '^9.1.0',
                    'eslint-plugin-prettier': '^5.1.3',
                    'eslint-plugin-import': '^2.26.0',
                    'eslint-plugin-jsx-a11y': '^6.6.1',
                    'eslint-plugin-react': '^7.30.1',
                    'eslint-plugin-formatjs': '^4.2.2',
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
