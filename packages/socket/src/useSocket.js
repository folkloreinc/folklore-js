import { useContext, useEffect, useState } from 'react';
import isString from 'lodash/isString';

import SocketContext from './SocketContext';

const useSocket = (
    channelNames = null,
    { socket: customSocket = null, onMessage: customOnMessage = null } = {},
) => {
    const { socket: contextSocket, subscribe, unsubscribe } = useContext(SocketContext);
    const socket = customSocket || contextSocket || null;
    const [started, setStarted] = useState(socket !== null ? socket.isStarted() : false);

    const channels = isString(channelNames) ? [channelNames] : channelNames;
    const channelsKey = (channels || []).sort().join(',');

    useEffect(() => {
        if (socket === null) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Socket context is empty.');
            }
            return () => {};
        }
        const wasStarted = socket.isStarted();
        const onStarted = () => setStarted(true);
        const onStop = () => setStarted(false);
        socket.on('stop', onStop);
        socket.on('started', onStarted);
        if (channels !== null) {
            subscribe(channels);
        }
        if (!wasStarted) {
            socket.start();
        }
        return () => {
            socket.off('stop', onStop);
            socket.off('started', onStarted);
            if (channels !== null) {
                unsubscribe(channels);
            }
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
        subscribe,
        unsubscribe,
    };
};

export default useSocket;
