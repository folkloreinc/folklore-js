export type AdSize = [number, number] | 'fluid';
export type Viewport = [number, number];
export type AdSizeMapping = [Viewport, AdSize[]];
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
    [key: string]: any;
}
export interface RichAd {
    type: string;
    [key: string]: any;
}
