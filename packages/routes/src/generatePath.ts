import { compile } from 'path-to-regexp';

export type PathParams = Record<string, unknown>;

export type GeneratePathOpts = Parameters<typeof compile>[1];

const compilers: Record<string, (params?: PathParams) => string> = {};

export default function generatePath(
    fullPath: string,
    data?: PathParams,
    opts: GeneratePathOpts = {},
): string {
    const fullUrlMatches = fullPath.match(/^(https?:\/\/)/);
    if (typeof compilers[fullPath] === 'undefined') {
        compilers[fullPath] = compile(fullPath.replace(/^(https?:\/\/)/, ''), opts);
    }
    const compiler = compilers[fullPath];
    return fullUrlMatches !== null ? `${fullUrlMatches[1]}${compiler(data)}` : compiler(data);
}
