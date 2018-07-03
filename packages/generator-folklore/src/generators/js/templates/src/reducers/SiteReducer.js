const initialState = {

};

const SiteReducer = (previousState, action) => {
    const state = {
        ...initialState,
        ...(previousState || null),
    };

    switch (action.type) {
    default:
        return state;
    }
};

export default SiteReducer;
