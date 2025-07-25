import EventEmitter from 'wolfy87-eventemitter';
import AdSlot, { AdSlotOptions as BaseAdSlotOptions } from './AdSlot';
import { AdSize } from './types';
declare global {
    interface Window {
        googletag?: any;
        refreshDisabledLineItems?: string[];
    }
}
interface AdSlotOptions extends BaseAdSlotOptions {
    id?: string;
}
declare class AdsManager extends EventEmitter {
    static ID_PREFIX: string;
    disabled: boolean;
    personnalizedAdsDisabled: boolean;
    ready: boolean;
    enabled: boolean;
    googletag: any;
    slots: AdSlot[];
    index: number;
    options: {
        disabled: boolean;
        disablePersonnalizedAds: boolean;
        disableSingleRequest: boolean;
        disableLazyLoad: boolean;
        disableVideoAds: boolean;
        autoInit: boolean;
        mobileScaling?: number;
        renderMarginPercent?: number;
        fetchMarginPercent?: number;
    };
    static getArticleTargeting(article: any): {
        title: any;
        slug: any;
        postID: any;
        categories: any;
        authors: any;
        sponsors: any;
        GoogleSafeTargeting: any;
    };
    static getSectionTargeting(section: any): {
        section: any;
    };
    static getIndexTargeting(index: any): {
        index: any;
    };
    static getIndexItemTargeting(index: any, item: any): {
        [index.id]: any[];
    };
    constructor(opts?: {});
    createAdId(): string;
    init(): void;
    initGpt(): void;
    onSlotRenderEnded(event: any): void;
    onSlotImpressionViewable(event: any): void;
    onSlotVisibleChange(visible: any, slot: any): void;
    isReady(): boolean;
    isDisabled(): boolean;
    setDisabled(disabled: any): void;
    disablePersonnalizedAds(disablePersonnalizedAds: any): void;
    createSlot(path: string, size: AdSize, opts?: AdSlotOptions): AdSlot;
    defineSlot(slot: any): void;
    displaySlots(): boolean;
    displaySlot(slot: any): void;
    callDisplaySlot(slot: any): void;
    destroySlot(id: any): void;
    refreshSlot(id: any): void;
    refreshSlots(ids: any): void;
    refreshAllSlots(): void;
}
export default AdsManager;
