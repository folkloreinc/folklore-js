import fsExtra from 'fs-extra';
import path from 'path';

const getOptionsFromPackage = (packagePath, keys = ['...build', 'proxy']) => {
    const finalPath = path.isAbsolute(packagePath)
        ? packagePath
        : path.join(process.cwd(), packagePath);
    if (!fsExtra.pathExistsSync(finalPath)) {
        return null;
    }
    const data = fsExtra.readJsonSync(finalPath);
    return keys.reduce((options, key) => {
        let matches = null;
        if ((matches = key.match(/^\.\.\.(.*)$/))) {
            const value = data[matches[1]] || null;
            return {
                ...options,
                ...value,
            };
        }
        const value = data[key] || null;
        return value !== null
            ? {
                  ...options,
                  [key]: value,
              }
            : options;
    }, null);
};

export default getOptionsFromPackage;
