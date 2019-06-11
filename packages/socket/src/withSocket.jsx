import React from 'react';

import SocketContext from './SocketContext';

const getDisplayName = WrappedComponent => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

const withSocket = (WrappedComponent) => {
    const WithSocketComponent = props => (
        <SocketContext.Consumer>
            {socket => <WrappedComponent socket={socket} {...props} />}
        </SocketContext.Consumer>
    );
    WithSocketComponent.displayName = `WithSocket(${getDisplayName(WrappedComponent)})`;
    return WithSocketComponent;
};

export default withSocket;
