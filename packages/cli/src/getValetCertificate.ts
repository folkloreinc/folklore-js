import { X509Certificate } from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

export interface ValetCertificate {
    name: string;
    directory: string;
    cert: string;
    key: string;
}

export const valetConfigDirectory = path.join(os.homedir(), '.config/valet');
export const herdConfigDirectory = path.join(
    os.homedir(),
    'Library/Application Support/Herd/config/valet',
);

// Certificates signed by the Valet CA for hostnames outside the Valet TLD (local.site.com),
// created by `flklr certificates --fix`.
export const localCertificatesDirectory = path.join(os.homedir(), '.config/flklr/certificates');

const certificatesDirectories = [
    path.join(valetConfigDirectory, 'Certificates'),
    path.join(herdConfigDirectory, 'Certificates'),
];

// Valet certificates also cover their direct subdomains (*.site.test), so parent domains are
// tried too: france.urbania.media.test uses the certificate of urbania.media.test.
function getCandidateHostnames(hostname: string): string[] {
    const parts = hostname.split('.');
    return parts.slice(0, -1).map((_, index) => parts.slice(index).join('.'));
}

// Local certificates cover several hostnames (local.site.com and local.site.fr), so they are
// matched on their subject alternative names instead of their file name.
export function getLocalCertificates(): ValetCertificate[] {
    if (!fs.existsSync(localCertificatesDirectory)) {
        return [];
    }
    return fs
        .readdirSync(localCertificatesDirectory)
        .filter((file) => file.endsWith('.crt'))
        .sort()
        .map((file) => {
            const name = file.slice(0, -'.crt'.length);
            return {
                name,
                directory: localCertificatesDirectory,
                cert: path.join(localCertificatesDirectory, file),
                key: path.join(localCertificatesDirectory, `${name}.key`),
            };
        })
        .filter(({ key }) => fs.existsSync(key));
}

export function getCertificateHostnames(certPath: string): string[] {
    try {
        const { subjectAltName = '' } = new X509Certificate(fs.readFileSync(certPath));
        return (subjectAltName || '')
            .split(',')
            .map((it) => it.trim())
            .filter((it) => it.startsWith('DNS:'))
            .map((it) => it.slice('DNS:'.length));
    } catch {
        return [];
    }
}

function getValetCertificate(hostname: string | null = null): ValetCertificate | null {
    if (hostname === null || hostname.length === 0) {
        return null;
    }
    const candidates = getCandidateHostnames(hostname);
    for (const directory of certificatesDirectories) {
        for (const candidate of candidates) {
            const cert = path.join(directory, `${candidate}.crt`);
            const key = path.join(directory, `${candidate}.key`);
            if (fs.existsSync(cert) && fs.existsSync(key)) {
                return { name: candidate, directory, cert, key };
            }
        }
    }
    return (
        getLocalCertificates().find(({ cert }) =>
            getCertificateHostnames(cert).includes(hostname),
        ) || null
    );
}

export default getValetCertificate;
