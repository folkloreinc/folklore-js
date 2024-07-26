import { getCSRFHeaders } from '@folklore/fetch';
import Panneau from '@panneau/app';
import { FIELDS_NAMESPACE } from '@panneau/core/contexts';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import * as AppPropTypes from '../lib/PropTypes';

import * as fieldsComponents from './panneau/fields';

import '../../styles/panneau.scss';

const propTypes = {
    definition: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    baseUrl: PropTypes.string.isRequired,
    uploadEndpoint: PropTypes.string,
    user: AppPropTypes.user,
    statusCode: AppPropTypes.statusCode,
};

const defaultProps = {
    user: null,
    uploadEndpoint: '/panneau/upload',
    statusCode: null,
};

const PanneauContainer = ({ definition, user, baseUrl, uploadEndpoint, statusCode }) => {
    const { routes = {} } = definition;
    const isAuthorized = statusCode !== 401 && statusCode !== 403;
    const [localeLoaded, setLocaleLoaded] = useState(false);

    useEffect(() => {
        let canceled = false;
        import(`@panneau/intl/locale/${definition.intl.locale}`).then(() => {
            if (!canceled) {
                setLocaleLoaded(true);
            }
        });
        return () => {
            canceled = true;
        };
    }, [definition]);

    return localeLoaded ? (
        <Panneau
            definition={definition}
            routes={routes}
            user={isAuthorized ? user : null}
            baseUrl={baseUrl}
            uppy={{
                transport: 'xhr',
                xhr: {
                    endpoint: uploadEndpoint,
                    headers: getCSRFHeaders(),
                    timeout: 0,
                },
            }}
            components={{
                [FIELDS_NAMESPACE]: fieldsComponents,
            }}
        />
    ) : null;
};

PanneauContainer.propTypes = propTypes;
PanneauContainer.defaultProps = defaultProps;

export default PanneauContainer;
