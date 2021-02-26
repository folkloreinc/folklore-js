import React from 'react';

const SocketContext = React.createContext({
    socket: null,
    subscribe: () => {},
    unsubscribe: () => {},
});

export default SocketContext;
