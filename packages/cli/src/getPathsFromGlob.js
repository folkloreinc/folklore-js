import path from 'path';
import fs from 'fs';
import isArray from 'lodash/isArray';
import { sync as globSync } from 'glob';

const getPathsFromGlob = (globs, { cwd = process.cwd() } = {}) =>
    (isArray(globs) ? globs : [globs]).reduce((allPaths, pathGlob) => {
        if (fs.existsSync(path.isAbsolute(pathGlob) ? pathGlob : path.join(cwd, pathGlob))) {
            return [...allPaths, pathGlob];
        }
        return [
            ...allPaths,
            ...globSync(pathGlob, {
                nodir: true,
                cwd,
            }),
        ];
    }, []);

export default getPathsFromGlob;
