/* globals GOOGLE_API_KEY: true */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

const KeysContext = React.createContext({
    googleApiKey: typeof GOOGLE_API_KEY !== 'undefined' ? GOOGLE_API_KEY : null,
});

const getDisplayName = WrappedComponent =>
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

export const withKeys = WrappedComponent => {
    const WithKeysComponent = props => (
        <KeysContext.Consumer>
            {keys => <WrappedComponent {...keys} {...props} />}
        </KeysContext.Consumer>
    );
    WithKeysComponent.displayName = `WithKeys(${getDisplayName(WrappedComponent)})`;
    return WithKeysComponent;
};

export default KeysContext;
