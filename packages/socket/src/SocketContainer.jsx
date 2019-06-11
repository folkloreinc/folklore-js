import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import Socket from './Socket';
import SocketContext from './SocketContext';

const propTypes = {
    socket: PropTypes.instanceOf(Socket),
    autoStart: PropTypes.bool,
    children: PropTypes.node,
};

const defaultProps = {
    socket: null,
    autoStart: false,
    children: null,
};

const SocketContainer = ({
    children, socket, autoStart, ...props
}) => {
    const finalSocket = useMemo(() => socket || new Socket(props), [socket]);
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
