import { AuthProvider } from '@folklore/auth';
import { type RoutesMap, RoutesProvider } from '@folklore/routes';
import { IntlProvider } from 'react-intl';
import { Router } from 'wouter';

import Routes from './Routes';
import TrackingProvider from '../contexts/TrackingContext';

const defaultRoutes: RoutesMap = { home: '/' };

interface AppProps {
    intl?: {
        locale?: string;
        messages?: Record<string, Record<string, string>> | Record<string, string>;
    } | null;
    user?: User | null;
    routes?: RoutesMap;
}

function App({ intl = null, routes = defaultRoutes, user = null }: AppProps) {
    const { locale = 'fr', messages = {} } = intl || {};
    return (
        <IntlProvider locale={locale} messages={messages[locale] || messages}>
            <Router>
                <RoutesProvider routes={routes}>
                    <AuthProvider user={user}>
                        <TrackingProvider>
                            <Routes />
                        </TrackingProvider>
                    </AuthProvider>
                </RoutesProvider>
            </Router>
        </IntlProvider>
    );
}

export default App;
