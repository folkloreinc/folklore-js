import { compile } from 'path-to-regexp';

const compilers = {};

export default function generatePath(fullPath, data, opts = {}) {
    const fullUrlMatches = fullPath.match(/^(https?:\/\/)/);
    if (typeof compilers[fullPath] === 'undefined') {
        compilers[fullPath] = compile(fullPath.replace(/^(https?:\/\/)/, ''), opts);
    }
    const compiler = compilers[fullPath];
    return fullUrlMatches !== null ? `${fullUrlMatches[1]}${compiler(data)}` : compiler(data);
}
