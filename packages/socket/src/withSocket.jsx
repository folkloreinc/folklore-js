import React from 'react';

import SocketContext from './SocketContext';

const getDisplayName = (WrappedComponent) =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

const withSocket = (WrappedComponent) => {
    const WithSocketComponent = (props) => (
        <SocketContext.Consumer>
            {({ socket, subscribe, unsubscribe }) => (
                <WrappedComponent
                    socket={socket}
                    socketSubscribe={subscribe}
                    socketUnsubscribe={unsubscribe}
                    {...props}
                />
            )}
        </SocketContext.Consumer>
    );
    WithSocketComponent.displayName = `WithSocket(${getDisplayName(WrappedComponent)})`;
    return WithSocketComponent;
};

export default withSocket;
