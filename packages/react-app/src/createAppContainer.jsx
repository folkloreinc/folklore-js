import React, { Component } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import { routerMiddleware } from 'react-router-redux';

import createStoreContainer from './createStoreContainer';
import createRouterContainer from './createRouterContainer';
import createUrlGeneratorContainer from './createUrlGeneratorContainer';
import createIntlContainer from './createIntlContainer';
import withUrlGeneratorMiddleware from './withUrlGeneratorMiddleware';

const DevTools = process.env.NODE_ENV !== 'production' ? require('./DevTools').default : null;

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function createAppContainer(opts) {
    const options = {
        propTypes: {},
        defaultProps: {},
        withRef: false,
        getUrlGeneratorRoutes: null,
        getIntlLocale: null,
        getIntlMessages: null,
        createRouterHistory: null,
        getStoreReducers: null,
        getStoreInitialState: null,
        getStoreMiddlewares: props => [
            routerMiddleware(props.history),
            withUrlGeneratorMiddleware(props.urlGenerator),
        ],
        storeHasChanged: null,
        ...opts,
    };

    const {
        withRef,
        propTypes,
        defaultProps,
        createRouterHistory,
        getUrlGeneratorRoutes,
        getIntlLocale,
        getIntlMessages,
        getStoreReducers,
        getStoreInitialState,
        getStoreMiddlewares,
        storeHasChanged,
    } = options;

    return (WrappedComponent) => {
        class Container extends Component {
            static getWrappedInstance() {
                invariant(
                    withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the createAppContainer() call.',
                );
                return this.wrappedInstance;
            }

            render() {
                const props = {
                    ...this.props,
                };

                if (withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return process.env.NODE_ENV !== 'production' ? (
                    <div>
                        <WrappedComponent {...props} />
                        <DevTools />
                    </div>
                ) : (
                    <WrappedComponent {...props} />
                );
            }
        }

        Container.propTypes = propTypes;
        Container.defaultProps = defaultProps;
        Container.displayName = `AppContainer(${getDisplayName(WrappedComponent)})`;
        Container.WrappedComponent = WrappedComponent;

        const AppContainer = hoistStatics(Container, WrappedComponent);
        const RouterContainer = createRouterContainer(
            createRouterHistory,
            { withRef },
        )(AppContainer);
        const IntlContainer = createIntlContainer(
            getIntlLocale,
            getIntlMessages,
            { withRef },
        )(RouterContainer);
        const StoreContainer = createStoreContainer(
            getStoreReducers,
            getStoreInitialState,
            getStoreMiddlewares,
            storeHasChanged,
            { withRef },
        )(IntlContainer);
        const UrlGeneratorContainer = createUrlGeneratorContainer(
            getUrlGeneratorRoutes,
            { withRef },
        )(StoreContainer);
        return UrlGeneratorContainer;
    };
}
