import { compile } from 'path-to-regexp';

const compilers = {};

export default function generatePath(path, data) {
    if (typeof compilers[path] === 'undefined') {
        compilers[path] = compile(path, { encode: encodeURIComponent });
    }
    const compiler = compilers[path];
    return compiler(data);
}
