import { RichAd as RichAdType } from './types';
export interface RichAdProps {
    richAd: RichAdType;
    [key: string]: any;
}
declare function RichAd({ richAd, ...props }: RichAdProps): import("react/jsx-runtime").JSX.Element;
export default RichAd;
