import { RoutesProvider } from '@folklore/routes';
import PropTypes from 'prop-types';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

// import * as AppPropTypes from '../lib/PropTypes';
import Routes from './Routes';

import '<%= getRelativeStylesPath('components/App.jsx', 'styles.scss') %>';

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

const App = ({ locale, messages, routes, statusCode, googleApiKey }) => {
    return (
        <IntlProvider locale={locale} messages={messages[locale] || messages}>
            <BrowserRouter>
                <RoutesProvider routes={routes}>
                    <App />
                </RoutesProvider>
            </BrowserRouter>
        </IntlProvider>
    );
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
