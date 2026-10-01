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
    return null;
}

export default getValetCertificate;
