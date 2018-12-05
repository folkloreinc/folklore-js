import { getLocaleFromLocation } from '../lib/utils';

export default {
    locale: getLocaleFromLocation(),
    messages: {
        'meta.title': 'Titre',
    },
    routes: {
        home: '/',
    },
};
