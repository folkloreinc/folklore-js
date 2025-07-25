import AdSlot from './AdSlot';
import { AdSizeMapping, AdsTargeting } from './types';
interface UseAdOptions {
    id?: string;
    sizeMapping?: AdSizeMapping[] | null;
    viewport?: string | null;
    targeting?: AdsTargeting | null;
    categoryExclusions?: string[] | null;
    refreshInterval?: number | null;
    alwaysRender?: boolean;
    onRender?: (event: any) => void | null;
    onDestroy?: (event: any) => void | null;
    disabled?: boolean;
    disableTracking?: boolean;
    rootMargin?: string;
}
declare function useAd(path: string, size: any, { id, sizeMapping, viewport, targeting, categoryExclusions, refreshInterval, alwaysRender, onRender, onDestroy, disabled, disableTracking, rootMargin, }?: UseAdOptions): {
    width: any;
    height: any;
    isFluid: boolean;
    refObserver: import("react").RefObject<any>;
    slot: AdSlot;
    disabled: boolean;
    id: string;
    isRendered: boolean;
    isEmpty: any;
    isVisible: boolean;
    renderEvent: any;
};
export default useAd;
