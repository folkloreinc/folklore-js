import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class EslintGenerator extends Generator {
    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Eslint Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
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
        };
    }

    get install() {
        return {
            npm() {
                if (this.options['skip-install']) {
                    return;
                }

                this.npmInstall([
                    'babel-preset-airbnb@latest',
                    'babel-eslint@latest',
                    'eslint@4.16.0',
                    'eslint-config-airbnb@latest',
                    'eslint-plugin-import',
                    'eslint-plugin-jsx-a11y',
                    'eslint-plugin-react',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
