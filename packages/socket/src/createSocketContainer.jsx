import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';

import Socket from './Socket';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const childContextTypes = {
    socket: PropTypes.instanceOf(Socket),
};

export default function createSocketContainer(socketOptionsGetter, opts) {
    const getSocketOptions = socketOptionsGetter || (props => ({
        namespace: props.socketNamespace,
        publishKey: props.socketPublishKey,
        subscribeKey: props.socketSubscribeKey,
    }));
    const options = {
        withRef: false,
        ...opts,
    };

    return (WrappedComponent) => {
        class SocketContainer extends Component {
            static getWrappedInstance() {
                invariant(
                    options.withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the createSocketContainer() call.',
                );
                return this.wrappedInstance;
            }

            constructor(props) {
                super(props);

                const socketOptions = getSocketOptions(props);
                this.state = {
                    socket: new Socket(socketOptions),
                    options: socketOptions,
                };
            }

            getChildContext() {
                return {
                    socket: this.state.socket,
                };
            }

            componentDidMount() {
                this.state.socket.start();
            }

            componentWillReceiveProps(nextProps) {
                const nextOptions = getSocketOptions(nextProps);
                const optionsChanged = (
                    JSON.stringify(this.state.options) !== JSON.stringify(nextOptions)
                );
                if (optionsChanged) {
                    this.setState({
                        socket: new Socket(nextOptions),
                        options: nextOptions,
                    });
                }
            }

            componentDidUpdate(prevProps, prevState) {
                const socketChanged = prevState.socket !== this.state.socket;
                if (socketChanged) {
                    const wasStarted = prevState.socket ? prevState.socket.isStarted() : false;
                    if (prevState.socket) {
                        prevState.socket.destroy();
                    }
                    if (wasStarted) {
                        this.state.socket.start();
                    }
                }
            }

            componentWillUnmount() {
                this.state.socket.destroy();
            }

            render() {
                const { socket } = this.state;
                const props = {
                    ...this.props,
                    socket,
                };

                if (options.withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return (
                    <WrappedComponent {...props} />
                );
            }
        }

        SocketContainer.childContextTypes = childContextTypes;
        SocketContainer.displayName = `SocketContainer(${getDisplayName(WrappedComponent)})`;
        SocketContainer.WrappedComponent = WrappedComponent;

        return hoistStatics(SocketContainer, WrappedComponent);
    };
}
