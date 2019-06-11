import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import Socket from './Socket';
import SocketContext from './SocketContext';

const propTypes = {
    socket: PropTypes.instanceOf(Socket),
    adapter: PropTypes.string,
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
    namespace,
    uuid,
    publishKey,
    subscribeKey,
    secretKey,
    channels,
    ...props
}) => {
    const finalSocket = useMemo(
        () => socket
            || new Socket({
                adapter,
                namespace,
                uuid,
                publishKey,
                subscribeKey,
                secretKey,
                channels,
                ...props,
            }),
        [
            socket,
            adapter,
            namespace,
            uuid,
            publishKey,
            subscribeKey,
            secretKey,
            ...channels,
            ...Object.keys(props),
        ],
    );
    useEffect(() => {
        if (autoStart) {
            finalSocket.start();
        }
        return () => {
            finalSocket.destroy();
        };
    }, [autoStart, finalSocket]);
    return <SocketContext.Provider value={finalSocket}>{children}</SocketContext.Provider>;
};

SocketContainer.propTypes = propTypes;
SocketContainer.defaultProps = defaultProps;

export default SocketContainer;
