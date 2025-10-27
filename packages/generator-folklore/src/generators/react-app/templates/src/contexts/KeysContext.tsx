/* globals GOOGLE_API_KEY: true */
import React, { useContext } from 'react';

const KeysContext = React.createContext({
    googleApiKey: typeof GOOGLE_API_KEY !== 'undefined' ? GOOGLE_API_KEY : null,
});

export const useKeys = () => useContext(KeysContext);

export const KeysProvider = ({ children = null, keys = null }: { children: React.ReactNode, keys: object | null }) => (
    <KeysContext.Provider value={keys}>{children}</KeysContext.Provider>
);

export default KeysContext;
