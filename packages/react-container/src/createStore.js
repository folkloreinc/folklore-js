/* eslint-disable import/no-extraneous-dependencies */
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

export default (reducers, initialState, middlewares = [], opts = {}) => {
    const options = {
        ...opts,
    };
    const reducer = combineReducers(reducers);
    let enhancer = applyMiddleware(...middlewares, thunk);

    if (process.env.NODE_ENV !== 'production') {
        const { devTools = {} } = options;
        const composeEnhancers = composeWithDevTools(devTools);
        enhancer = composeEnhancers(enhancer);
    }

    return createStore(reducer, initialState, enhancer);
};
