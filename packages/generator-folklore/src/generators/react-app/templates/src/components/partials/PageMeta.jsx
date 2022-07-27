/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Helmet } from 'react-helmet';
import { defineMessages, useIntl } from 'react-intl';

// import * as AppPropTypes from '../../lib/PropTypes';
import { isMessage } from '../../lib/utils';

const messages = defineMessages({
    title: {
        defaultMessage: 'Title',
        description: 'Page title',
    },
});

const propTypes = {
    title: AppPropTypes.message,
};

const defaultProps = {
    title: messages.title,
};

function PageMeta({ title }) {
    const intl = useIntl();
    return (
        <Helmet>
            <title>{isMessage(title) ? intl.formatMessage(title) : title}</title>
        </Helmet>
    );
}

PageMeta.propTypes = propTypes;
PageMeta.defaultProps = defaultProps;

export default React.memo(PageMeta);
