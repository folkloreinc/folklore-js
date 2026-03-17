import { RoutesProvider } from '@folklore/routes';
import { ConsentProvider } from '@micromag/core/contexts';
import { Router } from 'wouter';
import { IntlProvider } from '@micromag/intl';

import { AnalyticsProvider } from '../contexts/AnalyticsContext';
import { ModalProvider } from '../contexts/ModalContext';
import Routes from './Routes';

import defaultMicromags from '../micromags';

import '<%= getRelativeStylesPath('components/App.jsx', 'styles.css') %>';


interface IntlProps {
    locale?: string;
    messages?: Record<string, Record<string, string>> | Record<string, string>;
}

interface AppProps {
    intl?: IntlProps | null;
    routes?: Record<string, string>;
    googleAnalyticsIds?: Array<string>;
    micromags?: MicromagItem[] | null;
}

function App({ intl = null, routes, micromags = defaultMicromags, googleAnalyticsIds }: AppProps) {
    const { locale = 'fr', messages = null } = intl || {};
    const finalMessages = messages !== null && messages[locale] ? messages[locale] : messages;

    return (
        <IntlProvider locale={locale} messages={finalMessages || {}}>
            <ConsentProvider>
                <ModalProvider>
                    <AnalyticsProvider googleAnalyticsIds={googleAnalyticsIds || null}>
                        <Router>
                            <RoutesProvider routes={routes}>
                                <Routes micromags={micromags} />
                            </RoutesProvider>
                        </Router>
                    </AnalyticsProvider>
                </ModalProvider>
            </ConsentProvider>
        </IntlProvider>
    );
}

export default App;

