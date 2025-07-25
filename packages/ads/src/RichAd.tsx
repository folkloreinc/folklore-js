/* eslint-disable react/jsx-props-no-spreading */
import { getComponentFromName } from '@folklore/utils';

import { useAdsContext } from './AdsContext';
import { RichAd as RichAdType } from './types';

export interface RichAdProps {
    richAd: RichAdType;
    [key: string]: any;
}

function RichAd({ richAd, ...props }: RichAdProps) {
    const { type = null, ...richAdProps } = richAd;
    const { richAdComponents = null } = useAdsContext();
    const RichAdComponent = getComponentFromName(richAdComponents, type);
    return RichAdComponent !== null ? <RichAdComponent {...props} {...richAdProps} /> : null;
}

export default RichAd;
