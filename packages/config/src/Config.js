import get from 'lodash/get';
import set from 'lodash/set';

class Config {
    constructor(config) {
        this.config = config || {};
    }

    get(str) {
        return get(this.config, str);
    }

    set(str, val) {
        return set(this.config, str, val);
    }
}

export default Config;
