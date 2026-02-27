import { createContext } from 'react';

import Socket from './Socket';

type SocketContextType = {
    socket: Socket | null;
    subscribe: (channels: string[] | string) => void;
    unsubscribe: (channels: string[] | string) => void;
    channels?: string[];
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    subscribe: () => {},
    unsubscribe: () => {},
    channels: [],
});

export default SocketContext;
