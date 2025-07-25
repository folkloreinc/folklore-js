import { RichAd } from './types';
interface UseRichAdOptions {
    onRichAd?: (richAd: RichAd) => void | null;
}
declare function useRichAd(containerRef: any, id: string, opts?: UseRichAdOptions): any;
export default useRichAd;
