/**
 * @jest-environment node
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import createWebpackConfig from '../createWebpackConfig';

const packagePath = path.join(__dirname, '../..');
const fixturePath = path.join(__dirname, '../__fixtures__/production');

describe('createWebpackConfig', () => {
    const initialNodeEnv = process.env.NODE_ENV;
    let outputPath;

    beforeEach(() => {
        outputPath = fs.mkdtempSync(path.join(os.tmpdir(), 'folklore-cli-'));
    });

    afterEach(() => {
        process.env.NODE_ENV = initialNodeEnv;
        fs.rmSync(outputPath, { recursive: true, force: true });
    });

    test('keeps the default minimizers in production', () => {
        process.env.NODE_ENV = 'production';
        const config = createWebpackConfig(path.join(fixturePath, 'index.js'), {
            srcPath: fixturePath,
            outputPath,
        });
        expect(config.optimization.minimizer[0]).toBe('...');
    });

    // Runs the "flklr build" command from the sources in a child process
    test('minifies javascript chunks in production builds', () => {
        const result = spawnSync(
            process.execPath,
            [
                require.resolve('@babel/node/bin/babel-node'),
                '--eval',
                "require('./src/commands/build').default.parse(process.argv.slice(process.argv.indexOf('--') + 1), { from: 'user' })",
                '--',
                path.join(fixturePath, 'index.js'),
                '--src-path',
                fixturePath,
                '--output-path',
                outputPath,
                '--disable-source-map',
                '--disable-image-optimization',
            ],
            {
                cwd: packagePath,
                env: { ...process.env, NODE_ENV: 'production' },
                encoding: 'utf8',
            },
        );
        expect(result.stderr).toBe('');
        expect(result.status).toBe(0);

        const jsPath = path.join(outputPath, 'static/js');
        const chunks = fs.readdirSync(jsPath).filter((file) => file.endsWith('.chunk.js'));
        expect(chunks.length).toBeGreaterThan(0);
        chunks.forEach((chunk) => {
            const content = fs.readFileSync(path.join(jsPath, chunk), 'utf8');
            expect(content).not.toContain('A comment that a minified build should not keep');
            expect(content).not.toContain('currentItem');
            expect(content.trim().split('\n').length).toBeLessThanOrEqual(2);
        });
    }, 120000);
});
