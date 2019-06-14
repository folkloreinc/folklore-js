import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Container from '@folklore/react-container';
import { TrackingContainer } from '@folklore/tracking';

import reducers from '../reducers/index';
import * as AppPropTypes from '../lib/PropTypes';
import KeysContext from '../lib/KeysContext';

import App from './App';

const propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
        PropTypes.objectOf(PropTypes.string),
    ]),
    routes: PropTypes.objectOf(PropTypes.string),
    statusCode: AppPropTypes.statusCode,
};

const defaultProps = {
    locale: 'fr',
    messages: {},
    routes: {},
    statusCode: null,
};

class Root extends PureComponent {
    // eslint-disable-next-line class-methods-use-this
    getStoreProps() {
        const { statusCode } = this.props;
        return {
            reducers,
            initialState: {
                site: {
                    statusCode,
                },
            },
        };
    }

    getIntlProps() {
        const { locale, messages } = this.props;
        return {
            locale,
            messages,
        };
    }

    getUrlGenerator() {
        const { routes } = this.props;
        return {
            routes,
        };
    }

    // eslint-disable-next-line
    getKeys() {
        return {};
    }

    render() {
        return (
            <Container
                store={this.getStoreProps()}
                intl={this.getIntlProps()}
                urlGenerator={this.getUrlGenerator()}
            >
                <TrackingContainer>
                    <KeysContext.Provider value={this.getKeys()}>
                        <App />
                    </KeysContext.Provider>
                </TrackingContainer>
            </Container>
        );
    }
}

Root.propTypes = propTypes;
Root.defaultProps = defaultProps;

export default Root;
