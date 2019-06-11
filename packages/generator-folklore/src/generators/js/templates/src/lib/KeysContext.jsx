/* globals GOOGLE_API_KEY: true, STRIPE_API_KEY: true */
import React from 'react';

const KeysContext = React.createContext({
    googleApiKey: typeof GOOGLE_API_KEY !== 'undefined' ? GOOGLE_API_KEY : null,
    stripeApiKey: typeof STRIPE_API_KEY !== 'undefined' ? STRIPE_API_KEY : null,
});

const getDisplayName = WrappedComponent => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

export const withKeys = (WrappedComponent) => {
    const WithKeysComponent = props => (
        <KeysContext.Consumer>
            {keys => <WrappedComponent {...keys} {...props} />}
        </KeysContext.Consumer>
    );
    WithKeysComponent.displayName = `WithKeys(${getDisplayName(WrappedComponent)})`;
    return WithKeysComponent;
};

export default KeysContext;
