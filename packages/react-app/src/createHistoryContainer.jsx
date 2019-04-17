import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import createBrowserHistory from 'history/createBrowserHistory';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function createHistoryContainer(historyCreator, opts) {
    const options = {
        withRef: false,
        ...opts,
    };

    const { withRef } = options;

    const propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func,
        }),
    };

    const defaultProps = {
        history: null,
    };

    const defaultCreateHistory = () => createBrowserHistory();
    const createHistory = historyCreator || defaultCreateHistory;

    return (WrappedComponent) => {
        class HistoryContainer extends Component {
            static getWrappedInstance() {
                invariant(
                    withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the createHistoryContainer() call.',
                );
                return this.wrappedInstance;
            }

            constructor(props) {
                super(props);

                this.history = props.history || createHistory(props);
            }

            render() {
                const { history } = this;
                const props = {
                    ...this.props,
                    history,
                };

                if (withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return <WrappedComponent {...props} />;
            }
        }

        HistoryContainer.propTypes = propTypes;
        HistoryContainer.defaultProps = defaultProps;
        HistoryContainer.displayName = `HistoryContainer(${getDisplayName(WrappedComponent)})`;
        HistoryContainer.WrappedComponent = WrappedComponent;

        return hoistStatics(HistoryContainer, WrappedComponent);
    };
}
