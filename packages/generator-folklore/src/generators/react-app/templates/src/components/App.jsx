import { RoutesProvider } from '@folklore/routes';
import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'wouter';

// import * as AppPropTypes from '../lib/PropTypes';
import Routes from './Routes';

const propTypes = {
    intl: PropTypes.shape({
        locale: PropTypes.string,
        messages: PropTypes.oneOfType([
            PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
            PropTypes.objectOf(PropTypes.string),
        ]),
    }),
    routes: PropTypes.objectOf(PropTypes.string),
};

const defaultProps = {
    intl: null,
    routes: {
        home: '/'
    },
};

function App({ intl, routes }) {
    const { locale = 'fr', messages = {} } = intl || {};
    return (
        <IntlProvider locale={locale} messages={messages[locale] || messages}>
            <Router>
                <RoutesProvider routes={routes}>
                    <Routes />
                </RoutesProvider>
            </Router>
        </IntlProvider>
    );
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
