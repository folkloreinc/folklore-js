export type AdSize = googletag.SingleSize;
export type Viewport = googletag.SingleSizeArray;
export type AdSizeMapping = googletag.SizeMapping;

export interface Size {
    width: number;
    height: number;
}

export interface Viewports {
    [name: string]: Viewport;
}

export interface SlotDefinition {
    sizeMapping?: Record<string, AdSize[]> | boolean | null | AdSizeMapping[] | null;
    size?: AdSize[];
    path?: string | null;
}

export interface Slot extends SlotDefinition {
    sizeMapping?: AdSizeMapping[] | null;
}

export interface Slots {
    [name: string]: Slot;
}

export interface SlotsDefinition {
    [name: string]: SlotDefinition;
}

export interface AdsTargeting {
    refreshAds?: 'inactive' | false | null | number;
    disabled?: boolean;
    viewport?: string | null;
    [key: string]: unknown;
}

export interface RichAdType {
    type: string;
    [key: string]: unknown;
}
