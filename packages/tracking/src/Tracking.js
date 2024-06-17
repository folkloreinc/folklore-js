/* eslint-disable class-methods-use-this */
import { v4 as uuidv4 } from 'uuid';

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
            this.pushNow(...this.pending);
            this.pending = [];
        }
    }

    pushNow(...args) {
        const { dataLayer = null } = this.options;
        if (dataLayer === null || this.disabled) {
            return;
        }
        dataLayer.push(...args);
    }

    push(...args) {
        if (this.paused && !this.disabled) {
            this.pending.push(...args);
            return;
        }
        this.pushNow(...args);
    }

    pushEvent(eventName, data) {
        this.push({
            event: eventName,
            eventId: uuidv4(),
            ...data,
        });
    }

    trackEvent(category, action, label = null, value = null) {
        this.pushEvent('eventInteraction', {
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: value,
        });
    }

    trackSocial(network, action, target = null) {
        this.pushEvent('socialInteraction', {
            socialNetwork: network,
            socialAction: action,
            socialTarget: target || this.getSocialTarget(),
        });
    }

    trackVideo(
        action,
        {
            platform = null,
            id = null,
            url,
            title = null,
            duration = null,
            currentTime = null,
            thumbnail = null,
        } = {},
    ) {
        this.pushEvent('eventInteraction', {
            eventCategory: 'Video',
            eventAction: action,
            eventLabel: `${platform !== null ? `${platform}: ` : ''}${title || document.title}${
                id !== null ? ` (${id})` : ''
            }`,
            videoPlatform: platform,
            videoId: id,
            videoUrl: url,
            videoTitle: title,
            videoDuration: duration,
            videoCurrentTime: currentTime !== null ? Math.round(currentTime) : null,
            videoProgress:
                currentTime !== null && duration !== null && duration > 0
                    ? Math.round((currentTime / duration) * 100)
                    : null,
            videoThumbnail: thumbnail,
        });
    }

    getSocialTarget() {
        return typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.host}`
            : null;
    }
}

export default Tracking;
