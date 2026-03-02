import isString from 'lodash/isString';
import { JSX, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Socket from './Socket';
import SocketContext from './SocketContext';

type SocketContainerProps = {
    children?: ReactNode;
    socket?: Socket | null;
    autoStart?: boolean;
    adapter?: string | null;
    host?: string | null;
    namespace?: string | null;
    uuid?: string | null;
    publishKey?: string | null;
    subscribeKey?: string | null;
    secretKey?: string | null;
    channels?: string[];
    [key: string]: unknown;
};

function SocketContainer({
    children = null,
    socket = null,
    autoStart = false,
    adapter = 'pubnub',
    host = null,
    namespace = null,
    uuid = null,
    publishKey = null,
    subscribeKey = null,
    secretKey = null,
    channels: initialChannels,
    ...props
}: SocketContainerProps): JSX.Element {
    const finalSocket = useMemo(
        () =>
            socket ||
            new Socket({
                ...props,
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

    const [channels, setChannels] = useState<string[]>([]);
    const channelsCountRef = useRef<Record<string, number>>({});

    const updateChannels = useCallback(
        (newChannels: string[]) => {
            finalSocket.setChannels(newChannels);
            setChannels(newChannels);
        },
        [finalSocket, setChannels],
    );

    const addToChannelsCount = useCallback(
        (newChannels: string[]) => {
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
        (newChannels: string[]) => {
            channelsCountRef.current = newChannels.reduce((map, channel) => {
                const { [channel]: currentCount = 0, ...otherCount } = map;
                const newCount = (currentCount || 0) - 1;
                return newCount > 0
                    ? {
                          ...otherCount,
                          [channel]: newCount,
                      }
                    : otherCount;
            }, channelsCountRef.current);
            updateChannels(Object.keys(channelsCountRef.current));
        },
        [updateChannels],
    );

    const subscribe = useCallback(
        (channelsToAdd: string[] | string) =>
            addToChannelsCount(isString(channelsToAdd) ? [channelsToAdd] : channelsToAdd),
        [addToChannelsCount],
    );
    const unsubscribe = useCallback(
        (channelsToRemove: string[] | string) =>
            removeToChannelsCount(
                isString(channelsToRemove) ? [channelsToRemove] : channelsToRemove,
            ),
        [removeToChannelsCount],
    );

    useEffect(() => {
        subscribe(initialChannels || []);
        return () => {
            unsubscribe(initialChannels || []);
        };
    }, [initialChannels || [], subscribe, unsubscribe]);

    useEffect(() => {
        finalSocket.init();

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
}

export default SocketContainer;
