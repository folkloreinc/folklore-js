import {
    TEST_ACTION,
} from '../actions/LayoutActions';

const initialState = {
    tested: false,
};

const LayoutReducer = (previousState, action) => {
    const state = {
        ...initialState,
        ...(previousState || null),
    };

    switch (action.type) {
    case TEST_ACTION:
        return {
            ...state,
            tested: true,
        };
    default:
        return state;
    }
};

export default LayoutReducer;
