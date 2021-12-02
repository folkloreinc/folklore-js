import fs from 'fs';
import { isArray } from 'lodash';
import { sync as globSync } from 'glob';
import getAbsolutePath from './getAbsolutePath';

const getPathsFromGlob = (globs, { cwd = process.cwd() } = {}) => {
    const { paths, excludes } = (isArray(globs) ? globs : [globs]).reduce(
        ({ paths: currentPaths, excludes: currentExcludes }, globPath) => {
            const excludeMatches = globPath.match(/^[!-](.*)^/);
            const isExclude = excludeMatches !== null;
            const finalGlobPath = excludeMatches !== null ? excludeMatches[1] : globPath;
            const absGlobPath = getAbsolutePath(finalGlobPath, cwd);
            const pathExists = fs.existsSync(absGlobPath);
            const newPaths = pathExists
                ? [absGlobPath]
                : globSync(absGlobPath, {
                      nodir: true,
                      cwd,
                  });
            return {
                paths: !isExclude ? [...currentPaths, ...newPaths] : currentPaths,
                excludes: isExclude ? [...currentExcludes, ...newPaths] : currentExcludes,
            };
        },
        {
            paths: [],
            excludes: [],
        },
    );
    return paths.filter((it) => excludes.indexOf(it) === -1);
};

export default getPathsFromGlob;
