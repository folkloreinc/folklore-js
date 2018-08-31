import { SET_SIZE, SET_FONTS_LOADED } from '../actions/LayoutActions';

const initialState = {
    size: {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0,
    },
    fontsLoaded: false,
};

const LayoutReducer = (previousState, action) => {
    const state = {
        ...initialState,
        ...(previousState || null),
    };

    switch (action.type) {
    case SET_SIZE:
        return {
            ...state,
            size: {
                ...action.payload,
            },
        };
    case SET_FONTS_LOADED:
        return {
            ...state,
            fontsLoaded: action.payload,
        };
    default:
        return state;
    }
};

export default LayoutReducer;
