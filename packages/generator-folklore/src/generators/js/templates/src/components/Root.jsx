import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Container from '@folklore/react-container';

import reducers from '../reducers/index';
// import * as AppPropTypes from '../lib/PropTypes';

import App from './App';

const propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
        PropTypes.objectOf(PropTypes.string),
    ]),
    routes: PropTypes.objectOf(PropTypes.string),
};

const defaultProps = {
    locale: 'fr',
    messages: {},
    routes: {},
};

class Root extends PureComponent {
    // eslint-disable-next-line class-methods-use-this
    getStoreProps() {
        return {
            reducers,
            initialState: {

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

    render() {
        return (
            <Container
                store={this.getStoreProps()}
                intl={this.getIntlProps()}
                urlGenerator={this.getUrlGenerator()}
            >
                <App />
            </Container>
        );
    }
}

Root.propTypes = propTypes;
Root.defaultProps = defaultProps;

export default Root;
