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
            prettierrc() {
                const srcPath = this.templatePath('prettierrc.json');
                const destPath = this.destinationPath('.prettierrc.json');
                this.fs.copy(srcPath, destPath);
            },
        };
    }

    install() {
        if (this.options['skip-install']) {
            return;
        }

        this.npmInstall(
            [
                'babel-preset-airbnb@latest',
                '@babel/eslint-parser@latest',
                'eslint@latest',
                'eslint-config-airbnb@latest',
                'eslint-config-prettier@latest',
                'eslint-plugin-prettier@latest',
                'eslint-plugin-import',
                'eslint-plugin-jsx-a11y',
                'eslint-plugin-react',
                'eslint-plugin-formatjs',
            ],
            {
                'save-dev': true,
            },
        );
    }
};
