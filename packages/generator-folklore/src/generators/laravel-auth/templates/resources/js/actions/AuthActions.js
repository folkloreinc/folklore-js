/**
 * Constants
 */
export const SET_USER = 'auth@SET_USER';

/**
 * Actions creator
 */
export const setUser = payload => ({
    type: SET_USER,
    payload,
});
