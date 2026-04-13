import { EventEmitter } from '@folklore/events';

import { AdSizeMapping, AdsTargeting } from './types';

export type RenderEvent = googletag.events.SlotRenderEndedEvent & {
    width: number;
    height: number;
    isFluid: boolean;
    slot: AdSlot;
};

export interface AdSlotOptions {
    sizeMapping?: null | AdSizeMapping[];
    targeting?: AdsTargeting;
    categoryExclusions?: Array<string>;
    visible?: boolean;
}

type AddSlotEvents = {
    render: { event: googletag.events.SlotRenderEndedEvent; slot: AdSlot };
    visible: { visible: boolean; slot: AdSlot };
    destroy: AdSlot;
};

class AdSlot extends EventEmitter<AddSlotEvents> {
    options: AdSlotOptions;
    elementId: string;
    adPath: string;
    adSize: string | Array<string>;
    visible: boolean;
    wasVisible: boolean;
    adSlot: googletag.Slot | null;
    rendered: boolean;
    displayed: boolean;
    viewable: boolean;
    renderEvent: googletag.events.SlotRenderEndedEvent;
    refreshDisabled: boolean;
    destroyed: boolean;

    constructor(id, path, size, opts = {}) {
        super();

        this.options = {
            sizeMapping: null,
            targeting: {},
            categoryExclusions: [],
            visible: true,
            ...opts,
        };

        const { visible } = this.options;

        this.elementId = id;
        this.adPath = path;
        this.adSize = size;
        this.adSlot = null;
        this.visible = visible;
        this.wasVisible = visible;
        this.rendered = false;
        this.displayed = false;
        this.viewable = false;
        this.destroyed = false;
        this.renderEvent = null;
        this.refreshDisabled = false;
    }

    updateAdSlot() {
        const { adSlot } = this;
        const { targeting = {}, categoryExclusions = [], sizeMapping = null } = this.options;

        // Size mapping
        if (sizeMapping !== null) {
            adSlot.defineSizeMapping(sizeMapping);
        }

        // Targeting
        const targetingKeys = targeting !== null ? Object.keys(targeting) : null;
        if (targetingKeys !== null && targetingKeys.length > 0) {
            targetingKeys.forEach((key) => {
                adSlot.setTargeting(key, targeting[key]);
            });
        } else {
            adSlot.clearTargeting();
        }

        // Category exclusions
        if (categoryExclusions !== null && categoryExclusions.length > 0) {
            categoryExclusions.forEach((exclusion) => {
                adSlot.setCategoryExclusion(exclusion);
            });
        } else {
            adSlot.clearCategoryExclusions();
        }
    }

    setAdSlot(slot) {
        this.adSlot = slot;
        if (slot !== null) {
            this.updateAdSlot();
        }
        return this;
    }

    setRenderEvent(event: googletag.events.SlotRenderEndedEvent) {
        this.renderEvent = event;
        this.rendered = true;
        this.emit('render', { event, slot: this });
        return this;
    }

    setViewable(viewable) {
        this.viewable = viewable;
    }

    setDisplayed(displayed) {
        this.displayed = displayed;
        return this;
    }

    setVisible(visible) {
        this.visible = visible;
        if (!this.wasVisible && visible) {
            this.wasVisible = visible;
        }
        this.emit('visible', { visible, slot: this });
        return this;
    }

    setRefreshDisabled() {
        this.refreshDisabled = true;
    }

    setTargeting(targeting) {
        if (this.adSlot !== null) {
            this.adSlot.updateTargetingFromMap(targeting);
        }
        this.options.targeting = targeting;
    }

    destroy() {
        if (this.destroyed) {
            return;
        }
        this.emit('destroy', this);

        this.removeAllListeners();
        this.adSlot = null;
        this.rendered = false;
        this.displayed = false;
        this.renderEvent = null;
        this.destroyed = true;
    }

    getElementId() {
        return this.elementId;
    }

    getAdSlot() {
        return this.adSlot;
    }

    getAdPath() {
        return this.adPath;
    }

    getAdSize() {
        return this.adSize;
    }

    getTargeting() {
        const { targeting } = this.options;
        return targeting;
    }

    isVisible() {
        return this.visible;
    }

    isDefined() {
        return this.adSlot !== null;
    }

    isDisplayed() {
        return this.displayed;
    }

    isViewable() {
        return this.viewable;
    }

    isRendered() {
        return this.rendered;
    }

    isRefreshDisabled() {
        return this.refreshDisabled;
    }

    isDestroyed() {
        return this.destroyed;
    }

    isEmpty() {
        if (this.renderEvent === null) {
            return false;
        }
        return this.renderEvent.isEmpty;
    }

    canBeDisplayed() {
        return this.isDefined() && !this.isDisplayed();
    }

    getRenderedSize() {
        if (this.renderEvent === null) {
            return null;
        }
        const { size = null } = this.renderEvent;
        return size !== null
            ? {
                  width: size[0],
                  height: size[1],
                  isFluid: size[0] === 0 && size[1] === 0,
              }
            : null;
    }
}

export default AdSlot;
