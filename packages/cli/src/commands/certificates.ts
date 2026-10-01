import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { Command } from 'commander';
import { X509Certificate } from 'crypto';
import fs from 'fs';
import path from 'path';

import getValetCertificate, {
    herdConfigDirectory,
    valetConfigDirectory,
} from '../getValetCertificate';

type FixType = 'ca' | 'site';

interface CheckResult {
    label: string;
    ok: boolean;
    detail: string;
    fix?: FixType;
}

const caPath = path.join(valetConfigDirectory, 'CA/LaravelValetCASelfSigned.pem');
const certificatesPath = path.join(valetConfigDirectory, 'Certificates');

function readCertificate(filePath: string): X509Certificate | null {
    try {
        return new X509Certificate(fs.readFileSync(filePath));
    } catch {
        return null;
    }
}

function isExpired(certificate: X509Certificate): boolean {
    return new Date(certificate.validTo).getTime() <= Date.now();
}

function getValetTld(): string {
    try {
        const config = JSON.parse(
            fs.readFileSync(path.join(valetConfigDirectory, 'config.json'), 'utf8'),
        );
        return config.tld || 'test';
    } catch {
        return 'test';
    }
}

// Valet site names are hostnames without the TLD (urbania.media for urbania.media.test)
function getSiteName(hostname: string, tld: string): string {
    return hostname.replace(new RegExp(`\\.${tld}$`), '');
}

function getSecuredHostnames(tld: string): string[] {
    if (!fs.existsSync(certificatesPath)) {
        return [];
    }
    const suffix = `.${tld}.crt`;
    return fs
        .readdirSync(certificatesPath)
        .filter((file) => file.endsWith(suffix))
        .map((file) => file.slice(0, -'.crt'.length));
}

function isTrustedByKeychain(certPath: string, hostname: string): boolean | null {
    if (process.platform !== 'darwin') {
        return null;
    }
    const result = spawnSync(
        'security',
        ['verify-cert', '-c', certPath, '-p', 'ssl', '-s', hostname],
        { stdio: 'ignore' },
    );
    return result.status === 0;
}

function checkCa(ca: X509Certificate | null): CheckResult {
    if (ca === null) {
        return { label: 'Valet CA', ok: false, detail: `not found at ${caPath}`, fix: 'ca' };
    }
    if (isExpired(ca)) {
        return { label: 'Valet CA', ok: false, detail: `expired on ${ca.validTo}`, fix: 'ca' };
    }
    return { label: 'Valet CA', ok: true, detail: `valid until ${ca.validTo}` };
}

// Reports the first problem found for the site: certificate, hostname, CA signature, then trust.
function checkSite(hostname: string, ca: X509Certificate | null): CheckResult {
    const certificate = getValetCertificate(hostname);
    const site = certificate !== null ? readCertificate(certificate.cert) : null;
    if (certificate === null || site === null) {
        return {
            label: hostname,
            ok: false,
            detail: 'no certificate for this hostname or its parent domains',
            fix: 'site',
        };
    }
    if (isExpired(site)) {
        return { label: hostname, ok: false, detail: `expired on ${site.validTo}`, fix: 'site' };
    }
    if (site.checkHost(hostname) === undefined) {
        return {
            label: hostname,
            ok: false,
            detail: `${certificate.cert} does not cover this hostname`,
            fix: 'site',
        };
    }
    if (ca !== null && !(site.checkIssued(ca) && site.verify(ca.publicKey))) {
        return {
            label: hostname,
            ok: false,
            detail: 'not signed by the current Valet CA',
            fix: 'site',
        };
    }
    if (isTrustedByKeychain(certificate.cert, hostname) === false) {
        return {
            label: hostname,
            ok: false,
            detail: 'not trusted by the system keychain',
            fix: 'ca',
        };
    }
    return { label: hostname, ok: true, detail: `valid until ${site.validTo}` };
}

function checkCertificates(hostnames: string[]): CheckResult[] {
    const ca = fs.existsSync(caPath) ? readCertificate(caPath) : null;
    return [checkCa(ca), ...hostnames.map((hostname) => checkSite(hostname, ca))];
}

function printResults(results: CheckResult[]): void {
    console.log('');
    results.forEach(({ label, ok, detail }) => {
        const status = ok ? chalk.green('✔') : chalk.red('✖');
        console.log(`${status} ${label}${chalk.gray(`: ${detail}`)}`);
    });
    console.log('');
}

function runValet(args: string[]): boolean {
    console.log(chalk.cyan(`$ valet ${args.join(' ')}`));
    const result = spawnSync('valet', args, { stdio: 'inherit' });
    if (result.error) {
        console.error(
            chalk.red(`Could not run valet: ${result.error.message}. Is Valet installed?`),
        );
        return false;
    }
    return result.status === 0;
}

function fixCertificates(results: CheckResult[], tld: string): boolean {
    const failures = results.filter(({ ok }) => !ok);

    if (failures.some(({ fix }) => fix === 'ca')) {
        // Every site certificate is signed by the CA: renew the CA, then secure every site again.
        const failingSites = failures
            .filter(({ label }) => label !== 'Valet CA')
            .map(({ label }) => getSiteName(label, tld));
        const sites = Array.from(
            new Set([
                ...getSecuredHostnames(tld).map((hostname) => getSiteName(hostname, tld)),
                ...failingSites,
            ]),
        );
        console.log(
            chalk.yellow(
                `Renewing the Valet CA, then securing ${sites.length} site(s) again: ${sites.join(', ')}`,
            ),
        );
        fs.rmSync(path.dirname(caPath), { recursive: true, force: true });
        return sites.every((site) => runValet(['secure', site]));
    }

    return failures.every(({ label }) => {
        const certificate = getValetCertificate(label);
        const site = getSiteName(certificate !== null ? certificate.name : label, tld);
        return runValet(['secure', site]);
    });
}

const command = new Command('certificates');

command
    .alias('certs')
    .description(
        'Check the Valet certificates of a hostname, or of every secured site, and fix them with --fix',
    )
    .argument('[hostname]', 'Hostname to check (defaults to every site secured by Valet)')
    .option('--fix', 'Renew the Valet CA or the site certificates when needed (requires sudo)')
    .action((hostname = null) => {
        const { fix = false } = command.opts();

        if (!fs.existsSync(valetConfigDirectory) && fs.existsSync(herdConfigDirectory)) {
            console.log(
                chalk.yellow('Herd detected: renew certificates from Herd settings instead.'),
            );
        }

        const tld = getValetTld();
        const hostnames = hostname !== null ? [hostname] : getSecuredHostnames(tld);
        if (hostnames.length === 0) {
            console.log(chalk.yellow(`No site secured by Valet in ${certificatesPath}.`));
        }

        let results = checkCertificates(hostnames);
        printResults(results);

        if (results.every(({ ok }) => ok)) {
            return;
        }
        if (!fix) {
            console.log('Run again with --fix to renew them (requires sudo).');
            process.exitCode = 1;
            return;
        }

        if (!fixCertificates(results, tld)) {
            process.exitCode = 1;
            return;
        }

        results = checkCertificates(hostnames);
        printResults(results);
        if (results.some(({ ok }) => !ok)) {
            process.exitCode = 1;
            return;
        }
        console.log(chalk.green('Certificates fixed. Restart the dev server to use them.'));
    });

export default command;
