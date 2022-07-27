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
        };
    }

    async install() {
        if (this.options['skip-install']) {
            return;
        }

        await this.addDevDependencies([
            'babel-preset-airbnb',
            '@babel/eslint-parser',
            'eslint',
            'eslint-config-airbnb',
            'eslint-config-prettier',
            'eslint-plugin-prettier',
            'eslint-plugin-import',
            'eslint-plugin-jsx-a11y',
            'eslint-plugin-react',
            'eslint-plugin-formatjs',
        ]);
    }
};
