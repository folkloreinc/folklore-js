/**
 * Constants
 */
export const SET_SIZE = 'layout@SET_SIZE';
export const SET_FONTS_LOADED = 'layout@SET_FONTS_LOADED';

/**
 * Actions creator
 */
export const setSize = payload => ({
    type: SET_SIZE,
    payload,
});
export const setFontsLoaded = payload => ({
    type: SET_FONTS_LOADED,
    payload,
});
