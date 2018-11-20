const initialState = {

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
    default:
        return state;
    }
};

export default SiteReducer;
