const path = require('path');
/* eslint-disable import/no-extraneous-dependencies */
const get = require('lodash/get');
const glob = require('glob');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = () => {
    const lernaConfig = require('../../lerna.json'); // eslint-disable-line
    const packageJSON = require('../../package.json'); // eslint-disable-line
    const packages = get(lernaConfig, 'useWorkspaces', false) ? packageJSON.workspaces : lernaConfig.packages;
    return packages.reduce((items, packagesPath) => (
        [].concat(items).concat(glob.sync(path.join(__dirname, '../../', packagesPath)))
    ), []);
};
