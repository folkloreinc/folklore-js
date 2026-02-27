/* globals GOOGLE_API_KEY: true */
import { useContext, createContext, ReactNode } from 'react';

type KeysContextType = {
    googleApiKey?: string | null;
    [key: string]: unknown;
};

const KeysContext = createContext<KeysContextType>({
    googleApiKey: typeof GOOGLE_API_KEY !== 'undefined' ? GOOGLE_API_KEY : null,
});

export const useKeys = () => useContext(KeysContext);

interface KeysProviderProps {
    children: ReactNode;
    keys: KeysContextType | null;
}

export const KeysProvider = ({ children = null, keys = null }: KeysProviderProps) => (
    <KeysContext.Provider value={keys}>{children}</KeysContext.Provider>
);

export default KeysContext;
