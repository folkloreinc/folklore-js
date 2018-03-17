import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class TestGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('type', {
            type: String,
            required: false,
            defaults: 'jest',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Test Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            directories() {
                const { type } = this.options;
                this.fs.copy(this.templatePath(`${type}/mocks`), this.destinationPath('__mocks__'));
                this.fs.copy(this.templatePath(`${type}/tests`), this.destinationPath('__tests__'));
            },

            jestConfig() {
                const { type } = this.options;
                if (type !== 'jest') {
                    return;
                }
                const destPath = this.destinationPath('jest.config.js');
                if (!this.fs.exists(destPath)) {
                    this.fs.copy(this.templatePath(`${type}/jest.config.js`), destPath);
                }
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
                    'babel-jest@latest',
                    'enzyme@latest',
                    'enzyme-adapter-react-16@latest',
                    'eslint-plugin-jest@latest',
                    'jest@latest',
                    'jsdom@latest',
                    'react-test-renderer@latest',
                    'sinon@latest',
                ], {
                    'save-dev': true,
                });
            },
        };
    }
};
