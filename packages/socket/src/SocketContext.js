import { createContext } from 'react';

const SocketContext = createContext({
    socket: null,
    subscribe: () => {},
    unsubscribe: () => {},
});

export default SocketContext;
