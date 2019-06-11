import { useContext, useEffect, useState } from 'react';

import SocketContext from './SocketContext';

const useSocket = (channels, opts = {}) => {
    const { socket: customSocket = null, onMessage: customOnMessage = null } = opts;

    const contextSocket = useContext(SocketContext);
    const socket = customSocket || contextSocket || null;
    const [started, setStarted] = useState(socket !== null ? socket.isStarted() : false);

    useEffect(() => {
        if (socket === null) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Socket context is empty.');
            }
            return () => {};
        }
        socket.setChannels(channels);
        const onStarted = () => setStarted(true);
        const onStop = () => setStarted(false);
        const onMessage = (...args) => {
            if (customOnMessage !== null) {
                customOnMessage(...args);
            }
        };
        socket.on('message', onMessage);
        socket.on('stop', onStop);
        socket.on('started', onStarted);
        return () => {
            socket.setChannels([]);
            socket.off('message', onMessage);
            socket.on('stop', onStop);
            socket.on('started', onStarted);
        };
    }, [...channels, customSocket, customOnMessage]);

    return {
        socket,
        started,
    };
};

export default useSocket;
