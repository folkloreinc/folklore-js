import { compile } from 'path-to-regexp';

const compilers = {};

export default function generatePath(path, data, opts = {}) {
    if (typeof compilers[path] === 'undefined') {
        compilers[path] = compile(path, opts);
    }
    const compiler = compilers[path];
    return compiler(data);
}
