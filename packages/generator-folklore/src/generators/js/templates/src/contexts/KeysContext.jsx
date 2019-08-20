/* globals GOOGLE_API_KEY: true */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

const KeysContext = React.createContext({
    googleApiKey: typeof GOOGLE_API_KEY !== 'undefined' ? GOOGLE_API_KEY : null,
});

export const useKeys = () => useContext(KeysContext);

export const withKeys = WrappedComponent => {
    const getDisplayName = ({ displayName = null, name = null }) =>
        displayName || name || 'Component';

    const WithKeysComponent = props => (
        <KeysContext.Consumer>
            {keys => <WrappedComponent {...keys} {...props} />}
        </KeysContext.Consumer>
    );
    WithKeysComponent.displayName = `WithKeys(${getDisplayName(WrappedComponent)})`;
    return WithKeysComponent;
};

const propTypes = {
    children: PropTypes.node.isRequired,
    googleApiKey: PropTypes.string,
};

const defaultProps = {
    googleApiKey: null,
};

export const KeysProvider = ({ children, googleApiKey }) => (
    <KeysContext.Provider value={{ googleApiKey }}>{children}</KeysContext.Provider>
);

KeysProvider.propTypes = propTypes;
KeysProvider.defaultProps = defaultProps;

export default KeysContext;
