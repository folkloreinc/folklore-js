/* globals refreshDisabledLineItems: [] */
import createDebug from 'debug';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import EventEmitter from 'wolfy87-eventemitter';

// import loadGPT from './loadGPT';
import AdSlot from './AdSlot';

const debug = createDebug('folklore:ads');

class AdsManager extends EventEmitter {
    static index = 0;

    static createAdId() {
        const newId = `div-gpt-ad-${new Date().getTime()}-${Math.round(
            Math.random() * (Math.random() * 1000),
        )}-${AdsManager.index}`;
        AdsManager.index += 1;
        return newId;
    }

    static getArticleTargeting(article) {
        if (article === null) {
            return null;
        }
        const {
            id,
            title,
            slug,
            metadata: { categories = [], authors = [], sponsors = [], safeForDistribution = true },
        } = article;
        return {
            title,
            slug,
            postID: id,
            categories: categories.map((it) => it.slug),
            authors: authors.map((it) => it.slug),
            sponsors: sponsors.map((it) => it.name),
            GoogleSafeTargeting: safeForDistribution,
        };
    }

    static getSectionTargeting(section) {
        return section !== null
            ? {
                  section: section.slug,
              }
            : null;
    }

    static getIndexTargeting(index) {
        return index !== null
            ? {
                  index: index.slug,
              }
            : null;
    }

    static getIndexItemTargeting(index, item) {
        return index !== null && item !== null
            ? {
                  [index.id]: [item.slug],
              }
            : null;
    }

    constructor(opts = {}) {
        super();
        this.options = {
            disabled: false,
            disablePersonnalizedAds: false,
            enableSingleRequest: false,
            autoInit: false,
            ...opts,
        };

        this.onGPTReady = this.onGPTReady.bind(this);
        this.onSlotRenderEnded = this.onSlotRenderEnded.bind(this);
        this.onSlotImpressionViewable = this.onSlotImpressionViewable.bind(this);
        this.onSlotVisibleChange = this.onSlotVisibleChange.bind(this);

        this.disabled = this.options.disabled;
        this.personnalizedAdsDisabled = this.options.disablePersonnalizedAds;
        this.ready = false;
        this.enabled = false;
        this.googletag = typeof window !== 'undefined' ? window.googletag : { cmd: [] };
        this.slots = [];

        if (this.options.autoInit) {
            this.init();
        }
    }

    onGPTReady() {
        const { googletag } = this;

        this.ready = true;

        googletag.cmd.push(() => {
            const { disabled, personnalizedAdsDisabled } = this;
            const {
                enableSingleRequest = false,
                mobileScaling = 1.0,
                renderMarginPercent = 100,
                fetchMarginPercent = 300,
            } = this.options;

            if (disabled) {
                debug('Disable initial load');
                googletag.pubads().disableInitialLoad();
            }

            if (enableSingleRequest) {
                debug('Enable single request');
                googletag.pubads().enableSingleRequest();
            }

            if (personnalizedAdsDisabled) {
                debug('Disable personalized ads');
                googletag.pubads().setRequestNonPersonalizedAds(1);
            }

            googletag.pubads().enableLazyLoad({
                // Fetch slots within 5 viewports.
                fetchMarginPercent,
                // Render slots within 2 viewports.
                renderMarginPercent,
                // Double the above values on mobile, where viewports are smaller
                // and users tend to scroll faster.
                mobileScaling,
            });

            googletag.pubads().enableVideoAds();

            googletag.pubads().addEventListener('slotRenderEnded', this.onSlotRenderEnded);
            googletag
                .pubads()
                .addEventListener('impressionViewable', this.onSlotImpressionViewable);

            googletag.enableServices();

            this.enabled = true;

            debug('GPT is ready');

            if (!disabled) {
                this.emit('ready');
            }
        });
    }

    onSlotRenderEnded(event) {
        const { slot: eventSlot, lineItemId = null, size = [] } = event;

        const renderSlot = this.slots.find((slot) => eventSlot === slot.getAdSlot()) || null;
        if (renderSlot !== null) {
            renderSlot.setRenderEvent(event);
        }

        const lineItems =
            typeof window !== 'undefined' ? window.refreshDisabledLineItems || [] : [];

        if (isArray(lineItems) && lineItems.indexOf(lineItemId) > -1) {
            renderSlot.setRefreshDisabled();
        }

        if (event.isEmpty) {
            debug(
                'Render ended for slot #%s(%s). Slot is empty.',
                eventSlot.getSlotElementId(),
                eventSlot.getAdUnitPath(),
            );
        } else {
            debug(
                'Render ended for slot #%s(%s) with size %s.',
                eventSlot.getSlotElementId(),
                eventSlot.getAdUnitPath(),
                size !== null ? size.join('x') : '-',
            );
        }
    }

    onSlotImpressionViewable(event) {
        const { slot: eventSlot } = event;

        const impressionSlot = this.slots.find((slot) => eventSlot === slot.getAdSlot()) || null;
        if (impressionSlot !== null) {
            impressionSlot.setViewable(true);
        }

        debug(
            'Impression viewable for slot #%s(%s).',
            eventSlot.getSlotElementId(),
            eventSlot.getAdUnitPath(),
        );
    }

    // eslint-disable-next-line class-methods-use-this
    onSlotVisibleChange(visible, slot) {
        debug(
            'Slot #%s(%s) visibility change to %s',
            slot.getElementId(),
            slot.getAdPath(),
            visible ? 'visible' : 'not visible',
        );
    }

    init() {
        const { googletag } = this;
        debug('Initializing ads manager...');
        googletag.cmd.push(() => {
            this.onGPTReady();
        });
    }

    isReady() {
        return this.ready && this.enabled && !this.disabled;
    }

    isDisabled() {
        return this.disabled;
    }

    setDisabled(disabled) {
        const shouldRefresh = this.disabled && !disabled;
        this.disabled = disabled;

        if (shouldRefresh) {
            this.refreshAllSlots();
        }

        if (this.enabled && !disabled) {
            this.emit('ready');
        }
    }

    disablePersonnalizedAds(disablePersonnalizedAds) {
        const { googletag } = this;
        this.personnalizedAdsDisabled = disablePersonnalizedAds;
        googletag.cmd.push(() => {
            googletag.pubads().setRequestNonPersonalizedAds(disablePersonnalizedAds ? 1 : 0);
        });
    }

    createSlot(path, size, opts = {}) {
        const { id: providedId = null } = opts;
        const id = providedId || AdsManager.createAdId();

        debug('Creating slot #%s(%s)...', id, path);

        const slot = new AdSlot(id, path, size, {
            ...opts,
        });
        slot.on('visible', this.onSlotVisibleChange);
        this.slots.push(slot);

        return slot;
    }

    defineSlot(slot) {
        const { googletag } = this;
        googletag.cmd.push(() => {
            if (slot.isDestroyed() || slot.isDefined()) {
                return;
            }
            const id = slot.getElementId();
            const path = slot.getAdPath();
            const size = slot.getAdSize();
            debug('Defining slot #%s(%s)...', id, path);
            const adSlot = googletag.defineSlot(path, size, id).addService(googletag.pubads());
            slot.setAdSlot(adSlot);
        });
    }

    displaySlots() {
        const slotsToDisplay = this.slots.filter((slot) => slot.canBeDisplayed());
        const slotsCount = slotsToDisplay.length;
        if (slotsCount > 0) {
            debug('Displaying %i slot(s)...', slotsCount);
            slotsToDisplay.forEach((slot) => this.callDisplaySlot(slot));
        }
        return true;
    }

    displaySlot(slot) {
        if (!slot.canBeDisplayed()) {
            return;
        }
        this.callDisplaySlot(slot);
    }

    /* eslint-disable */
    callDisplaySlot(slot) {
        const { googletag } = this;
        googletag.cmd.push(() => {
            const id = slot.getElementId();
            const path = slot.getAdPath();
            debug('Displaying slot #%s(%s)...', id, path);
            googletag.display(slot.getAdSlot());
            if (googletag.pubads().isInitialLoadDisabled()) {
                googletag.pubads().refresh([slot.getAdSlot()]);
            }
            slot.setDisplayed(true);
        });
    }
    /* eslint-enable */

    destroySlot(id) {
        const { googletag } = this;
        const slot = isObject(id) ? id : this.slots.find((it) => it.getElementId() === id) || null;
        if (slot === null || slot.isDestroyed()) {
            return;
        }

        const adSlot = slot.getAdSlot();
        slot.destroy();
        this.slots = this.slots.filter((it) => it !== slot);

        if (adSlot !== null) {
            debug('Destroying slot #%s(%s)...', adSlot.getAdUnitPath(), adSlot.getSlotElementId());
            googletag.cmd.push(() => {
                googletag.destroySlots([adSlot]);
            });
        }
    }

    refreshSlot(id) {
        const { googletag } = this;
        const slot = isObject(id) ? id : this.slots.find((it) => it.getElementId() === id) || null;
        if (slot === null || slot.isDestroyed() || slot.isRefreshDisabled()) {
            return;
        }

        const adSlot = slot.getAdSlot();
        if (adSlot !== null) {
            debug('Refreshing slot #%s(%s)...', adSlot.getAdUnitPath(), slot.getElementId());
            googletag.cmd.push(() => {
                googletag.pubads().refresh([adSlot], { changeCorrelator: false });
            });
        }
    }

    refreshSlots(ids) {
        const { googletag } = this;
        const slots = ids
            .map((id) =>
                isObject(id)
                    ? id
                    : this.slots.find((it) => !it.isDestroyed() && it.getElementId() === id) ||
                      null,
            )
            .filter((it) => it !== null)
            .map((it) => it.getAdSlot());
        if (slots.length === 0) {
            return;
        }

        debug(
            'Refreshing slots %o...',
            slots.map((slot) => `#${slot.getElementId()}(${slot.getAdUnitPath()})`),
        );
        googletag.cmd.push(() => {
            googletag.pubads().refresh(slots);
        });
    }

    refreshAllSlots() {
        const { googletag } = this;
        debug('Refreshing all slots...');
        googletag.cmd.push(() => {
            googletag.pubads().refresh();
        });
    }
}

export default AdsManager;
