import React from 'react';
import Socket from './Socket';

const SocketContext = React.createContext(new Socket());

export default SocketContext;
