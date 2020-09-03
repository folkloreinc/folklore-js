import { useContext, useEffect, useState } from 'react';

import SocketContext from './SocketContext';

const useSocket = (channels, opts = {}) => {
    const { socket: customSocket = null, onMessage: customOnMessage = null } = opts;

    const contextSocket = useContext(SocketContext);
    const socket = customSocket || contextSocket || null;
    const [started, setStarted] = useState(socket !== null ? socket.isStarted() : false);
    const channelsKey = channels.sort().join(',');

    useEffect(() => {
        if (socket === null) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Socket context is empty.');
            }
            return () => {};
        }
        const wasStarted = socket.isStarted();
        socket.setChannels(channels);
        const onStarted = () => setStarted(true);
        const onStop = () => setStarted(false);

        socket.on('stop', onStop);
        socket.on('started', onStarted);
        if (!wasStarted) {
            socket.start();
        }
        return () => {
            socket.setChannels([]);
            socket.off('stop', onStop);
            socket.off('started', onStarted);
            if (!wasStarted) {
                socket.stop();
            }
        };
    }, [channelsKey, customSocket]);

    useEffect(() => {
        if (socket === null) {
            return () => {};
        }
        const onMessage = (...args) => {
            if (customOnMessage !== null) {
                customOnMessage(...args);
            }
        };
        socket.on('message', onMessage);
        return () => {
            socket.off('message', onMessage);
        };
    }, [customOnMessage]);

    return {
        socket,
        started,
    };
};

export default useSocket;
