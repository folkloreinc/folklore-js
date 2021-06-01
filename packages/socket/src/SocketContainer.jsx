import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import Socket from './Socket';
import SocketContext from './SocketContext';

const propTypes = {
    socket: PropTypes.instanceOf(Socket),
    adapter: PropTypes.string,
    host: PropTypes.string,
    namespace: PropTypes.string,
    uuid: PropTypes.string,
    publishKey: PropTypes.string,
    subscribeKey: PropTypes.string,
    secretKey: PropTypes.string,
    channels: PropTypes.arrayOf(PropTypes.string),
    autoStart: PropTypes.bool,
    children: PropTypes.node,
};

const defaultProps = {
    socket: null,
    adapter: 'pubnub',
    host: null,
    namespace: null,
    uuid: null,
    publishKey: null,
    subscribeKey: null,
    secretKey: null,
    channels: [],
    autoStart: false,
    children: null,
};

const SocketContainer = ({
    children,
    socket,
    autoStart,
    adapter,
    host,
    namespace,
    uuid,
    publishKey,
    subscribeKey,
    secretKey,
    channels: initialChannels,
}) => {
    const finalSocket = useMemo(
        () =>
            socket ||
            new Socket({
                adapter,
                host,
                namespace,
                uuid,
                publishKey,
                subscribeKey,
                secretKey,
            }),
        [socket, host, adapter, namespace, uuid, publishKey, subscribeKey, secretKey],
    );

    const [channels, setChannels] = useState([]);
    const channelsCountRef = useRef({});

    const updateChannels = useCallback(
        (newChannels) => {
            finalSocket.setChannels(newChannels);
            setChannels(newChannels);
        },
        [finalSocket, setChannels],
    );

    const addToChannelsCount = useCallback(
        (newChannels) => {
            channelsCountRef.current = newChannels.reduce(
                (map, channel) => ({
                    ...map,
                    [channel]: (map[channel] || 0) + 1,
                }),
                channelsCountRef.current,
            );
            updateChannels(Object.keys(channelsCountRef.current));
        },
        [updateChannels],
    );

    const removeToChannelsCount = useCallback(
        (newChannels) => {
            channelsCountRef.current = newChannels.reduce((map, channel) => {
                const newCount = (map[channel] || 0) - 1;
                return newCount > 0
                    ? {
                          ...map,
                          [channel]: newCount,
                      }
                    : map;
            }, channelsCountRef.current);
            updateChannels(Object.keys(channelsCountRef.current));
        },
        [updateChannels],
    );

    const subscribe = useCallback((channelsToAdd) => addToChannelsCount(channelsToAdd), [
        addToChannelsCount,
    ]);
    const unsubscribe = useCallback((channelsToRemove) => removeToChannelsCount(channelsToRemove), [
        removeToChannelsCount,
    ]);

    useEffect(() => {
        subscribe(initialChannels);
        return () => {
            unsubscribe(initialChannels);
        };
    }, [initialChannels, subscribe, unsubscribe]);

    useEffect(() => {
        if (autoStart) {
            finalSocket.start();
        }
        return () => {
            finalSocket.destroy();
        };
    }, [autoStart, finalSocket]);

    const value = useMemo(
        () => ({
            socket: finalSocket,
            subscribe,
            unsubscribe,
            channels,
        }),
        [finalSocket, subscribe],
    );

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

SocketContainer.propTypes = propTypes;
SocketContainer.defaultProps = defaultProps;

export default SocketContainer;
