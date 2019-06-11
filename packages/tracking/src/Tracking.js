/* eslint-disable class-methods-use-this */

class Tracking {
    constructor(opts = {}) {
        this.options = {
            dataLayer: window.dataLayer || null,
            ...opts,
        };
    }

    push(...args) {
        const { dataLayer } = this.options;
        if (dataLayer === null) {
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
            socialTarget: target || `${window.location.protocol}//${window.location.host}`,
        });
    }
}

export default Tracking;
