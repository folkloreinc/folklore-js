import React, { Component } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import isFunction from 'lodash/isFunction';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function createPropsContainer(propTypes, defaultProps, opts) {
    const options = {
        withRef: false,
        ...opts,
    };

    const { withRef } = options;

    return (WrappedComponent) => {
        class PropsContainer extends Component {
            static getWrappedInstance() {
                invariant(
                    withRef,
                    'To access the wrapped instance, you need to specify `{ withRef: true }` as the second argument of the createPropsContainer() call.',
                );
                return this.wrappedInstance;
            }

            render() {
                const props = {
                    ...this.props,
                };

                if (withRef) {
                    props.ref = (c) => {
                        this.wrappedInstance = c;
                    };
                }

                return (
                    <WrappedComponent {...props} />
                );
            }
        }

        PropsContainer.propTypes = {
            ...(isFunction(propTypes) ? propTypes() : propTypes),
        };
        PropsContainer.defaultProps = {
            ...(isFunction(defaultProps) ? defaultProps() : defaultProps),
        };
        PropsContainer.displayName = `PropsContainer(${getDisplayName(WrappedComponent)})`;
        PropsContainer.WrappedComponent = WrappedComponent;

        return hoistStatics(PropsContainer, WrappedComponent);
    };
}
