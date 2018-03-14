import {
    TEST_ACTION,
} from '../actions/TestActions';

const initialState = {
    tested: false,
};

const TestReducer = (previousState, action) => {
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

export default TestReducer;
