import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';

import Socket from './Socket';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const contextTypes = {
    socket: PropTypes.instanceOf(Socket),
};

export default function withSocket(opts) {
    const options = {
        withRef: false,
        ...opts,
    };

    return (WrappedComponent) => {
        class SocketContainer extends Component {
            static getWrappedInstance() {
                invariant(
                    options.withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the withSocket() call.',
                );
                return this.wrappedInstance;
            }

            render() {
                const { socket } = this.context;
                const props = {
                    ...this.props,
                    socket,
                };

                if (options.withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return <WrappedComponent {...props} />;
            }
        }

        SocketContainer.contextTypes = contextTypes;
        SocketContainer.displayName = `withSocket(${getDisplayName(WrappedComponent)})`;
        SocketContainer.WrappedComponent = WrappedComponent;

        return hoistStatics(SocketContainer, WrappedComponent);
    };
}
