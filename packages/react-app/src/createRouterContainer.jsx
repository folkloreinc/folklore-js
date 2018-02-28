import React, { Component } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import createBrowserHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function createRouterContainer(historyCreator, opts) {
    const createHistory = historyCreator || (() => createBrowserHistory());
    const options = {
        withRef: false,
        ...opts,
    };

    return (WrappedComponent) => {
        class RouterContainer extends Component {
            static getWrappedInstance() {
                invariant(
                    options.withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the createRouterContainer() call.',
                );
                return this.wrappedInstance;
            }

            constructor(props) {
                super(props);

                this.history = createHistory(props);
            }

            render() {
                const props = {
                    ...this.props,
                };

                if (options.withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return (
                    <ConnectedRouter history={this.history}>
                        <WrappedComponent {...props} />
                    </ConnectedRouter>
                );
            }
        }

        RouterContainer.displayName = `RouterContainer(${getDisplayName(WrappedComponent)})`;
        RouterContainer.WrappedComponent = WrappedComponent;

        return hoistStatics(RouterContainer, WrappedComponent);
    };
}
