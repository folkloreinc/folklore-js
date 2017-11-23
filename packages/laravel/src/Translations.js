import Polyglot from 'node-polyglot';

class Translations {
    constructor(translations, locale) {
        this.locale = locale;
        this.polyglots = Object.keys(translations).reduce((polyglots, key) => ({
            ...polyglots,
            [key]: new Polyglot({
                locale: key,
                phrases: translations[key] || {},
            }),
        }), {});
    }

    setLocale(locale) {
        this.locale = locale;
    }

    get(...args) {
        if (typeof this.polyglots[this.locale] === 'undefined') {
            return args[0];
        }
        return this.polyglots[this.locale].t(...args);
    }
}

export default Translations;
