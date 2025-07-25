import EventEmitter from 'wolfy87-eventemitter';
import { AdSizeMapping } from './types';
export interface AdSlotOptions {
    sizeMapping?: null | AdSizeMapping[];
    targeting?: {
        [key: string]: string | Array<string>;
    };
    categoryExclusions?: Array<string>;
    visible?: boolean;
}
declare class AdSlot extends EventEmitter {
    options: AdSlotOptions;
    elementId: string;
    adPath: string;
    adSize: string | Array<string>;
    visible: boolean;
    wasVisible: boolean;
    adSlot: any;
    rendered: boolean;
    displayed: boolean;
    viewable: boolean;
    renderEvent: any;
    refreshDisabled: boolean;
    destroyed: boolean;
    constructor(id: any, path: any, size: any, opts?: {});
    updateAdSlot(): void;
    setAdSlot(slot: any): this;
    setRenderEvent(event: any): this;
    setViewable(viewable: any): void;
    setDisplayed(displayed: any): this;
    setVisible(visible: any): this;
    setRefreshDisabled(): void;
    setTargeting(targeting: any): void;
    destroy(): void;
    getElementId(): string;
    getAdSlot(): any;
    getAdPath(): string;
    getAdSize(): string | string[];
    getTargeting(): {
        [key: string]: string | string[];
    };
    isVisible(): boolean;
    isDefined(): boolean;
    isDisplayed(): boolean;
    isViewable(): boolean;
    isRendered(): boolean;
    isRefreshDisabled(): boolean;
    isDestroyed(): boolean;
    isEmpty(): any;
    canBeDisplayed(): boolean;
    getRenderedSize(): {
        width: any;
        height: any;
        isFluid: boolean;
    };
}
export default AdSlot;
