import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';
import { hasLocaleData } from 'react-intl/src/locale-data-registry';

const propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    locale: PropTypes.string,
    messages: PropTypes.oneOfType([
        PropTypes.objectOf(PropTypes.string),
        PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
    ]),
    getLocale: PropTypes.func,
    getMessages: PropTypes.func,
    /* eslint-enable react/no-unused-prop-types */
    children: PropTypes.node,
};

const defaultProps = {
    locale: 'en',
    messages: {},
    getLocale: null,
    getMessages: null,
    children: null,
};

class IntlContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locales: {},
        };
    }
    componentDidMount() {
        const locale = this.getLocale();
        this.loadLocaleData(locale);
    }

    componentWillUpdate(nextProps, nextState) {
        const localesChanged = nextState.locales !== this.state.locales;
        if (localesChanged) {
            const localesData = Object.values(nextState.locales).reduce(
                (allLocales, locales) => [...allLocales, ...locales],
                [],
            );
            addLocaleData(localesData);
        }
    }

    componentDidUpdate(prevProps) {
        const prevLocale = this.getLocale(prevProps);
        const locale = this.getLocale();
        const localeChanged = prevLocale !== locale;
        if (localeChanged) {
            this.loadLocaleData(locale);
        }
    }

    getLocale(props) {
        const { getLocale, locale } = props || this.props;
        return getLocale !== null ? getLocale() : locale;
    }

    getMessages(props) {
        const { getMessages, messages } = props || this.props;
        const locale = this.getLocale(props);
        return getMessages !== null ? getMessages(locale) : messages[locale] || messages;
    }

    loadLocaleData(locale) {
        if (hasLocaleData(locale)) {
            return;
        }
        import(`react-intl/locale-data/${locale}`).then(({ default: localeData }) => {
            this.setState(state => ({
                locales: {
                    ...state.locales,
                    [locale]: localeData,
                },
            }));
        });
    }

    render() {
        const {
            children, getLocale, getMessages, ...props
        } = this.props;
        const locale = this.getLocale();

        if (!hasLocaleData(locale)) {
            return null;
        }

        return (
            <IntlProvider {...props} locale={locale} messages={this.getMessages()}>
                {children}
            </IntlProvider>
        );
    }
}

IntlContainer.propTypes = propTypes;
IntlContainer.defaultProps = defaultProps;

export default IntlContainer;
