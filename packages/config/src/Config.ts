import get from 'lodash-es/get';
import set from 'lodash-es/set';

class Config {
    config: Record<string, unknown>;

    constructor(config: Record<string, unknown> = {}) {
        this.config = config;
    }

    get(str?: string): unknown {
        return get(this.config, str);
    }

    set(str: string, val: unknown): unknown {
        return set(this.config, str, val);
    }
}

export default Config;
