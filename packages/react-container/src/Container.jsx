import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import StoreContainer from './StoreContainer';
import IntlContainer from './IntlContainer';
import RouterContainer from './RouterContainer';
import UrlGeneratorContainer from './UrlGeneratorContainer';

const propTypes = {
    store: PropTypes.oneOfType([
        PropTypes.shape({
            ...StoreContainer.propTypes,
        }),
        PropTypes.bool,
    ]),
    intl: PropTypes.oneOfType([
        PropTypes.shape({
            ...IntlContainer.propTypes,
        }),
        PropTypes.bool,
    ]),
    urlGenerator: PropTypes.oneOfType([
        PropTypes.shape({
            ...UrlGeneratorContainer.propTypes,
        }),
        PropTypes.bool,
    ]),
    router: PropTypes.oneOfType([
        PropTypes.shape({
            ...RouterContainer.propTypes,
            memoryHistory: PropTypes.bool,
            createHistory: PropTypes.func,
        }),
        PropTypes.bool,
    ]),
    children: PropTypes.node.isRequired,
};

const defaultProps = {
    store: null,
    intl: null,
    urlGenerator: null,
    router: null,
};

class Container extends PureComponent {
    constructor(props) {
        super(props);

        this.renderRouter = this.renderRouter.bind(this);
        this.renderIntl = this.renderIntl.bind(this);
        this.renderUrlGenerator = this.renderUrlGenerator.bind(this);
        this.renderStore = this.renderStore.bind(this);

        this.history = props.router !== false ? this.createHistory() : null;
    }

    // eslint-disable-next-line class-methods-use-this
    createHistory() {
        const { router } = this.props;
        const memoryHistory = isObject(router) ? get(router, 'memoryHistory', false) : false;
        const createHistory = isObject(router) ? get(router, 'createHistory', null) : null;
        if (createHistory !== null) {
            return createHistory(router);
        }
        return memoryHistory ? createMemoryHistory() : createBrowserHistory();
    }

    renderRouter(children) {
        const { router } = this.props;
        const { memoryHistory, createHistory, ...routerProps } = isObject(router) ? router : {};
        return (
            <RouterContainer history={this.history} {...routerProps}>
                {children}
            </RouterContainer>
        );
    }

    renderIntl(children) {
        const { intl } = this.props;
        return <IntlContainer {...intl}>{children}</IntlContainer>;
    }

    renderUrlGenerator(children) {
        const { urlGenerator } = this.props;
        return <UrlGeneratorContainer {...urlGenerator}>{children}</UrlGeneratorContainer>;
    }

    renderStore(children) {
        const { store, router } = this.props;
        return (
            <StoreContainer
                getReducers={reducers =>
                    (router !== false
                        ? {
                            router: routerReducer,
                            ...reducers,
                        }
                        : reducers)
                }
                getMiddlewares={middlewares =>
                    (router !== false
                        ? [routerMiddleware(this.history), ...middlewares]
                        : middlewares)
                }
                {...store}
            >
                {children}
            </StoreContainer>
        );
    }

    render() {
        const {
            store, intl, urlGenerator, router, children,
        } = this.props;

        const renderMethods = [
            {
                test: router !== false,
                render: this.renderRouter,
            },
            {
                test: urlGenerator !== false,
                render: this.renderUrlGenerator,
            },
            {
                test: intl !== false,
                render: this.renderIntl,
            },
            {
                test: store !== false,
                render: this.renderStore,
            },
        ];

        return renderMethods.reduce((element, { test, render }) => (
            test ? render(element) : element
        ), children);
    }
}

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export default Container;
