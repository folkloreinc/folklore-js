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
                this.addDevDependencies([
                    'babel-preset-airbnb@^5.0.0',
                    '@babel/eslint-parser@^7.0.0',
                    'eslint@^8.0.0',
                    'eslint-config-airbnb@^19.0.0',
                    'eslint-config-prettier@^8.0.0',
                    'eslint-plugin-prettier@^4.0.0',
                    'eslint-plugin-import@^2.0.0',
                    'eslint-plugin-jsx-a11y@^6.0.0',
                    'eslint-plugin-react@^7.0.0',
                    'eslint-plugin-formatjs@^4.0.0',
                ])
            }
        };
    }

    async install() {
        if (this.options['skip-install']) {
            return;
        }

        await this.spawnCommand('npm', ['install']);
    }
};
