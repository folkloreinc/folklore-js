// eslint-disable-next-line import/prefer-default-export
export const getLocaleFromLocation = (currentLocation = window.location, locales = ['fr', 'en']) => {
    const { pathname = '/' } = currentLocation;
    const localeRegEx = new RegExp(`^/(${locales.join('|')})(/.*)?$`, 'i');
    const matches = pathname.match(localeRegEx);
    return matches !== null ? matches[1] : locales[0];
};
