/* eslint-disable class-methods-use-this */

class Tracking {
    constructor(opts = {}) {
        this.options = {
            dataLayer: typeof window !== 'undefined' ? window.dataLayer || null : null,
            disabled: false,
            paused: false,
            variables: null,
            ...opts,
        };

        const { disabled = false, paused = false, variables = null } = this.options;

        this.disabled = disabled;
        this.paused = paused;
        this.variables = null;

        this.pending = [];

        if (variables !== null) {
            this.setVariables(variables);
        }
    }

    setVariables(variables) {
        this.variables = variables;
        if (variables !== null) {
            this.pushNow(variables);
        }
    }

    getVariables() {
        return this.variables;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
        if (disabled) {
            this.pending = [];
        }
    }

    setPaused(paused) {
        this.paused = paused;
        if (!paused && this.pending.length > 0) {
            this.push(...this.pending);
            this.pending = [];
        }
    }

    pushNow(...args) {
        const { dataLayer } = this.options;
        if (dataLayer === null || this.disabled) {
            return;
        }
        dataLayer.push(...args);
    }

    push(...args) {
        const { paused = false, disabled = false, dataLayer } = this.options;
        if (dataLayer === null || disabled) {
            return;
        }
        if (paused) {
            this.pending.push(...args);
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
