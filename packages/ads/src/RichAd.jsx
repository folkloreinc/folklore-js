/* eslint-disable react/jsx-props-no-spreading */
import { getComponentFromName } from '@folklore/utils';
import PropTypes from 'prop-types';
import React from 'react';

import { useAdsContext } from './AdsContext';

const propTypes = {
    richAd: PropTypes.shape({
        type: PropTypes.string.isRequired,
    }).isRequired,
};

const defaultProps = {};

function RichAd({ richAd, ...props }) {
    const { type = null, ...richAdProps } = richAd;
    const { richAdComponents = null } = useAdsContext();
    const RichAdComponent = getComponentFromName(richAdComponents, type);
    return RichAdComponent !== null ? <RichAdComponent {...props} {...richAdProps} /> : null;
}
RichAd.propTypes = propTypes;
RichAd.defaultProps = defaultProps;

export default RichAd;
