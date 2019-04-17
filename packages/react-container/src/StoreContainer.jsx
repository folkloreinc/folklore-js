import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';

import configureStore from './configureStore';

const propTypes = {
    reducers: PropTypes.objectOf(PropTypes.func),
    initialState: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    middlewares: PropTypes.arrayOf(PropTypes.func),
    options: PropTypes.shape({
        devTools: PropTypes.object,
    }),
    updateStoreInProduction: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    getReducers: PropTypes.func,
    getInitialState: PropTypes.func,
    getMiddlewares: PropTypes.func,
    getOptions: PropTypes.func,
    createStore: PropTypes.func,
    updateStore: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    storeChanged: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    children: PropTypes.node,
};

const defaultProps = {
    reducers: {},
    initialState: {},
    middlewares: [],
    options: null,
    updateStoreInProduction: false,
    getReducers: null,
    getInitialState: null,
    getMiddlewares: null,
    getOptions: null,
    createStore: null,
    updateStore: null,
    storeChanged: null,
    children: null,
};

class StoreContainer extends Component {
    static getDerivedStateFromProps(props, state) {
        if (
            (process.env.NODE_ENV !== 'production' || props.updateStoreInProduction)
            && StoreContainer.storeChanged(state.prevProps, props)
        ) {
            return {
                store: StoreContainer.updateStore(state.store, props),
                storeKey: `store-${new Date().getTime()}`,
                prevProps: props,
            };
        }
        return {
            prevProps: props,
        };
    }

    static storeChanged(prevProps, nextProps) {
        const { storeChanged } = nextProps;
        return storeChanged !== null
            ? storeChanged(prevProps, nextProps)
            : isEqual(prevProps, nextProps);
    }

    static updateStore(store, props) {
        const { updateStore } = props;
        const reducers = this.getReducers();
        const initialState = this.getInitialStoreState();
        const middlewares = this.getMiddlewares();
        const options = this.getOptions();
        const storeState = {
            ...initialState,
            ...store.getState(),
        };
        return updateStore !== null
            ? updateStore(reducers, storeState, middlewares, options)
            : configureStore(reducers, storeState, middlewares, options);
    }

    constructor(props) {
        super(props);

        this.state = {
            store: this.createStore(props),
            storeKey: `store-${new Date().getTime()}`,
            prevProps: props, // eslint-disable-line react/no-unused-state
        };
    }

    getReducers() {
        const { reducers, getReducers } = this.props;
        return getReducers !== null ? getReducers(reducers) : reducers;
    }

    getInitialStoreState() {
        const { initialState, getInitialState } = this.props;
        return getInitialState !== null ? getInitialState(initialState) : initialState;
    }

    getMiddlewares() {
        const { middlewares, getMiddlewares } = this.props;
        return getMiddlewares !== null ? getMiddlewares(middlewares) : middlewares;
    }

    getOptions() {
        const { options, getOptions } = this.props;
        return getOptions !== null ? getOptions(options) : options;
    }

    createStore() {
        const { createStore } = this.props;
        const reducers = this.getReducers();
        const initialState = this.getInitialStoreState();
        const middlewares = this.getMiddlewares();
        const options = this.getOptions();
        return createStore !== null
            ? createStore(reducers, initialState, middlewares, options)
            : configureStore(reducers, initialState, middlewares, options);
    }

    render() {
        const { children } = this.props;
        const { store, storeKey } = this.state;
        return (
            <Provider store={store} key={storeKey}>
                {children}
            </Provider>
        );
    }
}

StoreContainer.propTypes = propTypes;
StoreContainer.defaultProps = defaultProps;

export default StoreContainer;
