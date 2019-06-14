import { SET_USER } from '../actions/AuthActions';

const initialState = {
    user: null,
};

const AuthReducer = (previousState, action) => {
    let state = previousState || initialState;
    if (typeof state.hydrated === 'undefined' || !state.hydrated) {
        state = {
            ...initialState,
            ...previousState,
            hydrated: true,
        };
    }
    switch (action.type) {
    case SET_USER:
        return {
            ...state,
            user: action.payload,
        };
    default:
        return state;
    }
};

export default AuthReducer;
