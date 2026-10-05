import chalk from 'chalk';
import { execFileSync } from 'child_process';

import Generator from '../../lib/generator';

export default class AgentsGenerator extends Generator {
    constructor(...args) {
        super(...args);

        this.option('git-host', {
            type: String,
            desc: 'Git host of the repository: github or gitlab (defaults to the host of the origin remote, or github)',
        });
    }

    getGitHost() {
        const { 'git-host': gitHost = null } = this.options;
        if (gitHost !== null) {
            return gitHost === 'gitlab' ? 'gitlab' : 'github';
        }

        try {
            const remoteUrl = execFileSync('git', ['remote', 'get-url', 'origin'], {
                cwd: this.destinationRoot(),
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore'],
            });
            return remoteUrl.includes('gitlab') ? 'gitlab' : 'github';
        } catch {
            // No git repository or no origin remote yet
            return 'github';
        }
    }

    prompting() {
        if (this.options.quiet) {
            return;
        }

        console.log(chalk.yellow('\n----------------------'));
        console.log('AGENTS.md Generator');
        console.log(chalk.yellow('----------------------\n'));
    }

    writing() {
        const destPath = this.destinationPath('AGENTS.md');

        const hasComposerJson = this.fs.exists(this.destinationPath('composer.json'));
        const hasPackageJson = this.fs.exists(this.destinationPath('package.json'));

        const existingContent = this.fs.exists(destPath) ? this.fs.read(destPath) : '';

        const separator = '\n\n---\n\n';
        const parts = [
            this.fs.read(this.templatePath('general.md')),
            this.fs.read(this.templatePath(`workflow-${this.getGitHost()}.md`)),
            hasComposerJson ? this.fs.read(this.templatePath('laravel.md')) : null,
            hasPackageJson ? this.fs.read(this.templatePath('frontend.md')) : null,
            hasComposerJson ? this.fs.read(this.templatePath('serve-laravel.md')) : null,
            !hasComposerJson && hasPackageJson
                ? this.fs.read(this.templatePath('serve-html.md'))
                : null,
            this.fs.read(this.templatePath('after.md')),
        ]
            .filter((it) => it !== null)
            .join(separator);

        const newContent =
            existingContent.length > 0 ? `${existingContent}${separator}${parts}` : parts;

        this.fs.write(destPath, newContent);

        // Claude Code reads CLAUDE.md, not AGENTS.md: import AGENTS.md from it
        const claudePath = this.destinationPath('CLAUDE.md');
        const claudeImport = '@AGENTS.md';
        const existingClaudeContent = this.fs.exists(claudePath) ? this.fs.read(claudePath) : '';
        const hasClaudeImport = existingClaudeContent
            .split('\n')
            .some((line) => line.trim() === claudeImport);
        if (!hasClaudeImport) {
            this.fs.write(
                claudePath,
                existingClaudeContent.length > 0
                    ? `${claudeImport}\n\n${existingClaudeContent}`
                    : `${claudeImport}\n`,
            );
        }
    }
}
