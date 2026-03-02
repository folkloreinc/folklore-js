import { type RoutesMap, RoutesProvider } from '@folklore/routes';
import { IntlProvider } from 'react-intl';
import { Router } from 'wouter';

import Routes from './Routes';

const defaultRoutes: RoutesMap = { home: '/' };

interface AppProps {
    intl?: {
        locale?: string;
        messages?: Record<string, Record<string, string>> | Record<string, string>;
    } | null;
    routes?: RoutesMap;
}

function App({ intl = null, routes = defaultRoutes }: AppProps) {
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

export default App;
