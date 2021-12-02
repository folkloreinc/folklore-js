import fsExtra from 'fs-extra';
import getAbsolutePath from './getAbsolutePath';

const getOptionsFromPackage = (packagePath, keys = ['...build', 'proxy']) => {
    const absPackagePath = getAbsolutePath(packagePath);
    if (!fsExtra.pathExistsSync(absPackagePath)) {
        return null;
    }
    const data = fsExtra.readJsonSync(absPackagePath);
    return keys.reduce((options, key) => {
        const matches = key.match(/^\.\.\.(.*)$/);
        if (matches !== null) {
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
