import BaseGenerator from 'yeoman-generator';
import Immutable from 'immutable';
import path from 'path';
import _ from 'lodash';

class Generator extends BaseGenerator {

    static prompts = {
        project_name: {
            type: 'input',
            name: 'project-name',
            message: 'What is the name of the project?',
            default: () => {
                const parts = process.cwd().split(path.sep);
                return parts[parts.length - 1];
            },
        },
    };

    static getConfigPath() {
        const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
        return path.join(home, '.config/yeoman-generator-folklore/config.json');
    }

    constructor(...args) {
        super(...args);

        this.option('quiet', {
            type: Boolean,
            defaults: false,
        });
    }

    getConfig() {
        const configPath = Generator.getConfigPath();
        return this.fs.exists(configPath) ? this.fs.readJSON(configPath) : {};
    }

    updateConfig(data, force) {
        const forceUpdate = force || false;

        const config = Immutable.fromJS(this.getConfig());
        let newConfig = Object.assign({}, config);
        _.each(data, (value, key) => {
            if (forceUpdate || (value && value.length && value !== _.get(config, key))) {
                newConfig = newConfig.set(key, value);
            }
        });

        const newData = newConfig.toJS();

        if (config !== newConfig) {
            const configPath = Generator.getConfigPath();
            this.fs.writeJSON(configPath, newData);
        }

        return newData;
    }

}

export default Generator;
