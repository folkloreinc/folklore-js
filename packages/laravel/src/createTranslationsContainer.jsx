import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import Translations from './Translations';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const childContextTypes = {
    translations: PropTypes.instanceOf(Translations),
    locale: PropTypes.string,
};

export default function createTranslationsContainer(selectTranslations, selectLocale, opts) {
    const translationsSelector = selectTranslations || (props => props.translations || null);
    const localeSelector = selectLocale || (props => props.locale || null);

    const options = {
        withRef: false,
        ...opts,
    };

    return (WrappedComponent) => {
        class TranslationsContainer extends Component {
            static getWrappedInstance() {
                invariant(
                    options.withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the createTranslationsContainer() call.',
                );
                return this.wrappedInstance;
            }

            constructor(props) {
                super(props);

                const translations = translationsSelector(props);
                const locale = localeSelector(props);

                this.state = {
                    translations: translations !== null && locale !== null ?
                        new Translations(translations, locale) : null,
                };
            }

            getChildContext() {
                const locale = localeSelector(this.props);
                return {
                    translations: this.state.translations,
                    locale,
                };
            }

            componentWillReceiveProps(nextProps) {
                const nextTranslations = translationsSelector(nextProps);
                const nextLocale = localeSelector(nextProps);
                const translations = translationsSelector(this.props);
                const locale = localeSelector(this.props);
                const translationsChanged = (
                    JSON.stringify(nextTranslations) !== JSON.stringify(translations)
                );
                const localeChanged = nextLocale !== locale;
                if (translationsChanged || localeChanged) {
                    this.setState({
                        translations: nextTranslations !== null && nextLocale !== null ?
                            new Translations(nextTranslations, nextLocale) : null,
                    });
                }
            }

            render() {
                const props = {
                    ...this.props,
                    translations: this.state.translations,
                };

                if (options.withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return (
                    <WrappedComponent {...props} />
                );
            }
        }

        TranslationsContainer.childContextTypes = childContextTypes;
        TranslationsContainer.displayName = `TranslationsContainer(${getDisplayName(WrappedComponent)})`;
        TranslationsContainer.WrappedComponent = WrappedComponent;

        return hoistStatics(TranslationsContainer, WrappedComponent);
    };
}
