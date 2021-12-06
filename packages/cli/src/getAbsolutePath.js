import path from 'path';

const getAbsolutePath = (filePath, relative = process.cwd()) => {
    if (filePath === null) {
        return null;
    }
    if (filePath[0] === '~') {
        return path.join(process.env.HOME, filePath.slice(1));
    }
    return path.isAbsolute(filePath) ? filePath : path.join(relative, filePath);
};

export default getAbsolutePath;
