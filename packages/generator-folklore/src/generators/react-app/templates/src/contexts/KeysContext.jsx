/* globals GOOGLE_API_KEY: true */

/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

const KeysContext = React.createContext({
    googleApiKey: typeof GOOGLE_API_KEY !== 'undefined' ? GOOGLE_API_KEY : null,
});

export const useKeys = () => useContext(KeysContext);

export const withKeys = (WrappedComponent) => {
    const getDisplayName = ({ displayName = null, name = null }) =>
        displayName || name || 'Component';

    const WithKeysComponent = (props) => (
        <KeysContext.Consumer>
            {(keys) => <WrappedComponent {...keys} {...props} />}
        </KeysContext.Consumer>
    );
    WithKeysComponent.displayName = `WithKeys(${getDisplayName(WrappedComponent)})`;
    return WithKeysComponent;
};

const propTypes = {
    children: PropTypes.node.isRequired,
    keys: PropTypes.objectOf(PropTypes.string),
};

export const KeysProvider = ({ children = null, keys = null }) => (
    <KeysContext.Provider value={keys}>{children}</KeysContext.Provider>
);

KeysProvider.propTypes = propTypes;

export default KeysContext;
