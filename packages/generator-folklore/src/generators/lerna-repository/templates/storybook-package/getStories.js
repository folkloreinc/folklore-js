const path = require('path');
const glob = require('glob');
const fs = require('fs');

const getStories = () => {
    const storyPaths = glob.sync(path.join(process.env.PWD,'./src/__stories__/*.story.jsx'));
    const storyCodes = storyPaths.map((storyPath) => (
        fs.readFileSync(storyPath).toString()
            .replace(/\'\.\.\//gi, `'${path.dirname(storyPath)}/../`)
            .replace(/\'\.\//gi, `'${path.dirname(storyPath)}/`)
    ));
    return {
        code: storyCodes.join('\n'),
        dependencies: storyPaths.map((storyPath) => require.resolve(storyPath)),
    };
};

module.exports = getStories;
