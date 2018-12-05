// eslint-disable-next-line import/prefer-default-export
export const getLocaleFromLocation = (locales = ['fr', 'en'], currentLocation = window.location) => {
    const { pathname = '/' } = currentLocation;
    const localeRegEx = new RegExp(`^/(${locales.join('|')})(/.*)?$`, 'i');
    const matches = pathname.match(localeRegEx);
    return matches !== null ? matches[1] : locales[0];
};
