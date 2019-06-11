import { LOCATION_CHANGE } from 'connected-react-router';
import { SET_ERRORS } from '../actions/SiteActions';

const initialState = {
    errors: null,
    statusCode: null,
    messages: null,
};

const SiteReducer = (previousState, action) => {
    let state = previousState || initialState;
    if (typeof state.hydrated === 'undefined' || !state.hydrated) {
        state = {
            ...initialState,
            ...previousState,
            hydrated: true,
        };
    }
    switch (action.type) {
    case SET_ERRORS:
        return {
            ...state,
            errors: action.payload,
        };
    case LOCATION_CHANGE:
        return typeof state.initialLocationChange === 'undefined' || !state.initialLocationChange ? {
            ...state,
            initialLocationChange: true,
        } : {
            ...state,
            errors: null,
            statusCode: null,
            messages: null,
        };
    default:
        return state;
    }
};

export default SiteReducer;
