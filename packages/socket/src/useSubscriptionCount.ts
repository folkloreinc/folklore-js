import { useContext, useEffect, useState } from 'react';

import Socket from './Socket';
import SocketContext from './SocketContext';

interface UseSubscriptionCountOptions {
    socket?: Socket | null;
}

/**
 * The number of subscribers of a channel (the readers of an article), for adapters that report it
 * (Pingpong). Null until the adapter reports one. It doesn't subscribe to the channel: `useSocket`
 * does.
 */
function useSubscriptionCount(
    channel: string | null,
    { socket: customSocket = null }: UseSubscriptionCountOptions = {},
): number | null {
    const { socket: contextSocket } = useContext(SocketContext);
    const socket = customSocket || contextSocket || null;
    const [reported, setReported] = useState<{ channel: string; count: number } | null>(null);

    useEffect(() => {
        if (socket === null || channel === null) {
            return () => {};
        }
        const onCount = (payload: { channel: string; count: number }) => {
            if (payload.channel === channel) {
                setReported(payload);
            }
        };
        socket.on('subscriptionCount', onCount);
        return () => {
            socket.off('subscriptionCount', onCount);
        };
    }, [socket, channel]);

    if (socket === null || channel === null) {
        return null;
    }
    return reported !== null && reported.channel === channel
        ? reported.count
        : socket.getSubscriptionCount(channel);
}

export default useSubscriptionCount;
