/**
 * Constants
 */
export const SET_ERRORS = 'site@SET_ERRORS';

/**
 * Actions creator
 */
export const setErrors = payload => ({
    type: SET_ERRORS,
    payload,
});

export const resetErrors = () => ({
    type: SET_ERRORS,
    payload: null,
});
