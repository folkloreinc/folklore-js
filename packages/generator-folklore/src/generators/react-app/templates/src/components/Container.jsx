import { RoutesProvider } from '@folklore/routes';
import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

// import * as AppPropTypes from '../lib/PropTypes';
import App from './App';

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
    routes: {},
};

function Container({ intl, routes }) {
    const { locale = null, messages = null } = intl || {};
    return (
        <IntlProvider locale={locale} messages={messages[locale] || messages}>
            <BrowserRouter>
                <RoutesProvider routes={routes}>
                    <App />
                </RoutesProvider>
            </BrowserRouter>
        </IntlProvider>
    );
}

Container.propTypes = propTypes;
Container.defaultProps = defaultProps;

export default Container;
