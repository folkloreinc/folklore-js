import { EventEmitter } from '@folklore/events';
import { v4 as uuidv4 } from 'uuid';

type TrackingPayload = Record<string, unknown>;

type TrackVideoPayload = {
    platform?: string | null;
    id?: string | null;
    url?: string | null;
    title?: string | null;
    duration?: number | null;
    currentTime?: number | null;
    thumbnail?: string | null;
} & TrackingPayload;

type TrackingOptions = {
    dataLayer?: TrackingPayload[] | null;
    disabled?: boolean;
    paused?: boolean;
    variables?: TrackingPayload | null;
    withoutIdleCallback?: boolean;
    pageViewEvents?: string[];
};

declare global {
    interface Window {
        dataLayer?: TrackingPayload[];
    }
}

class Tracking extends EventEmitter {
    options: Required<Omit<TrackingOptions, 'variables' | 'dataLayer'>> & {
        variables: TrackingPayload | null;
        dataLayer: TrackingPayload[] | null;
    };
    disabled: boolean;
    paused: boolean;
    variables: TrackingPayload | null;
    page: TrackingPayload | null;
    pending: TrackingPayload[];

    constructor(opts: TrackingOptions = {}) {
        super();
        this.options = {
            dataLayer: typeof window !== 'undefined' ? window.dataLayer || null : null,
            disabled: false,
            paused: false,
            variables: null,
            withoutIdleCallback: false,
            pageViewEvents: ['pageview', 'page_view', 'pageView'],
            ...opts,
        };

        const { disabled = false, paused = false, variables = null } = this.options;

        this.disabled = disabled;
        this.paused = paused;
        this.variables = null;
        this.page = null;

        this.pending = [];

        if (variables !== null) {
            this.setVariables(variables);
        }
    }

    isPageViewEvent(eventName: string): boolean {
        const { pageViewEvents = [] } = this.options;
        return pageViewEvents.indexOf(eventName) !== -1;
    }

    setPage(page: TrackingPayload): void {
        this.page = page;
        this.emit('page', page);
    }

    setVariables(variables: TrackingPayload | null): void {
        this.variables = variables;
        if (variables !== null) {
            this.pushNow(variables);
        }
    }

    getVariables(): TrackingPayload | null {
        return this.variables;
    }

    setDisabled(disabled: boolean): void {
        this.disabled = disabled;
        if (disabled) {
            this.pending = [];
        }
    }

    setPaused(paused: boolean): void {
        this.paused = paused;
        if (!paused && this.pending.length > 0) {
            this.pushNow(...this.pending);
            this.pending = [];
        }
    }

    pushNow(...args: TrackingPayload[]): void {
        const { dataLayer = null, withoutIdleCallback = false } = this.options;
        if (dataLayer === null || this.disabled) {
            return;
        }
        if (!withoutIdleCallback && 'requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                dataLayer.push(...args);
            });
        } else if (!withoutIdleCallback) {
            setTimeout(() => {
                dataLayer.push(...args);
            }, 0);
        } else {
            dataLayer.push(...args);
        }
    }

    push(...args: TrackingPayload[]): void {
        if (this.paused && !this.disabled) {
            this.pending.push(...args);
            return;
        }
        this.pushNow(...args);
    }

    pushEvent(eventName: string, data: TrackingPayload): void {
        this.push({
            event: eventName,
            eventId: uuidv4(),
            ...data,
        });
        if (this.isPageViewEvent(eventName)) {
            this.setPage(data);
        }
    }

    pushEventNow(eventName: string, data: TrackingPayload): void {
        this.pushNow({
            event: eventName,
            eventId: uuidv4(),
            ...data,
        });
        if (this.isPageViewEvent(eventName)) {
            this.setPage(data);
        }
    }

    trackEvent(
        category: string,
        action: string,
        label: string | null = null,
        value: string | number | null = null,
        data: TrackingPayload | null = null,
    ): void {
        this.pushEvent('eventInteraction', {
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: value,
            ...data,
        });
    }

    trackEventNow(
        category: string,
        action: string,
        label: string | null = null,
        value: string | number | null = null,
        data: TrackingPayload | null = null,
    ): void {
        this.pushEventNow('eventInteraction', {
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            eventValue: value,
            ...data,
        });
    }

    trackSocial(network: string, action: string, target: string | null = null): void {
        this.pushEvent('socialInteraction', {
            socialNetwork: network,
            socialAction: action,
            socialTarget: target || this.getSocialTarget(),
        });
    }

    trackVideo(
        action: string,
        {
            platform = null,
            id = null,
            url,
            title = null,
            duration = null,
            currentTime = null,
            thumbnail = null,
            ...data
        }: TrackVideoPayload = {},
    ): void {
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
            ...data,
        });
    }

    getSocialTarget(): string | null {
        return typeof window !== 'undefined'
            ? `${window.location.protocol}//${window.location.host}`
            : null;
    }
}

export default Tracking;
