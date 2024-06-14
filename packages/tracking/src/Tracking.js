/* eslint-disable class-methods-use-this */

class Tracking {
    constructor(opts = {}) {
        this.options = {
            dataLayer: typeof window !== 'undefined' ? window.dataLayer || null : null,
            disabled: false,
            variables: null,
            ...opts,
        };

        this.variables = null;

        const { variables = null } = this.options;
        if (variables !== null) {
            this.setVariables(variables);
        }
    }

    setVariables(variables) {
        this.variables = variables;
        if (variables !== null) {
            this.push(variables);
        }
    }

    getVariables() {
        return this.variables;
    }

    push(...args) {
        const { disabled = false, dataLayer } = this.options;
        if (dataLayer === null || disabled) {
            return;
        }
        dataLayer.push(...args);
    }

    trackEvent(category, action, label = null, value = null) {
        this.push({
            event: 'eventInteraction',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: value,
        });
    }

    trackSocial(network, action, target = null) {
        this.push({
            event: 'socialInteraction',
            socialNetwork: network,
            socialAction: action,
            socialTarget: target || this.getSocialTarget(),
        });
    }

    getSocialTarget() {
        return typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.host}`
            : null;
    }
}

export default Tracking;
