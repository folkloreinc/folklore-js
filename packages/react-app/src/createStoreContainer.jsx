import React, { Component } from 'react';
import { Provider } from 'react-redux';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import isEqual from 'lodash/isEqual';
import { configureStore } from '@folklore/react-container';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function createStoreContainer(
    getReducers,
    getInitialState,
    getMiddlewares,
    storeHasChanged,
    opts,
) {
    const options = {
        withRef: false,
        ...opts,
    };

    const defaultGetReducers = () => ({});
    const defaultGetInitialState = () => ({});
    const defaultGetMiddlewares = () => [];
    const defaultStoreHasChanged = (props, nextProps) => isEqual(props, nextProps);
    const storeChanged = storeHasChanged || defaultStoreHasChanged;
    const createStore = props => configureStore(
        (getReducers || defaultGetReducers)(props),
        (getInitialState || defaultGetInitialState)(props),
        (getMiddlewares || defaultGetMiddlewares)(props),
    );

    const updateStore = (store, props) => {
        const initialState = (getInitialState || defaultGetInitialState)(props);
        const state = {
            ...initialState,
            ...store.getState(),
        };
        return configureStore(
            (getReducers || defaultGetReducers)(props),
            state,
            (getMiddlewares || defaultGetMiddlewares)(props),
        );
    };

    return (WrappedComponent) => {
        class StoreContainer extends Component {
            static getWrappedInstance() {
                invariant(
                    options.withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the createStoreContainer() call.',
                );
                return this.wrappedInstance;
            }

            constructor(props) {
                super(props);

                this.state = {
                    store: createStore(props),
                    storeKey: `store-${new Date().getTime()}`,
                };
            }

            componentWillReceiveProps(nextProps) {
                const { store, storeKey } = this.state;
                if (storeChanged(this.props, nextProps)) {
                    this.setState({
                        store:
                            process.env.NODE_ENV !== 'production'
                                ? updateStore(store, nextProps)
                                : createStore(nextProps),
                        storeKey:
                            process.env.NODE_ENV !== 'production'
                                ? storeKey
                                : `store-${new Date().getTime()}`,
                    });
                }
            }

            render() {
                const { store, storeKey } = this.state;
                const props = {
                    ...this.props,
                    store,
                };

                if (options.withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return (
                    <Provider store={store} key={storeKey}>
                        <WrappedComponent {...props} />
                    </Provider>
                );
            }
        }

        StoreContainer.displayName = `StoreContainer(${getDisplayName(WrappedComponent)})`;
        StoreContainer.WrappedComponent = WrappedComponent;

        return hoistStatics(StoreContainer, WrappedComponent);
    };
}
