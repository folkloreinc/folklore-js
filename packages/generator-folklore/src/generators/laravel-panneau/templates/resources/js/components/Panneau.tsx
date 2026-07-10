import '@panneau/app/assets/css/styles.css';

import { getCSRFHeaders } from '@folklore/fetch';
import Panneau from '@panneau/app';
import { PanneauDefinition } from '@panneau/core';
import { FIELDS_NAMESPACE } from '@panneau/core/contexts';
import { useEffect, useState } from 'react';

import * as fieldsComponents from './panneau/fields';

import '../../styles/panneau.css';

export interface PanneauContainerProps {
    definition: PanneauDefinition;
    baseUrl: string;
    uploadEndpoint?: string;
    user?: User | null;
    statusCode?: number | null;
}

const PanneauContainer = ({
    definition,
    user = null,
    baseUrl,
    uploadEndpoint = '/panneau/upload',
    statusCode = null,
}: PanneauContainerProps) => {
    const { routes = {} } = definition;
    const isAuthorized = statusCode !== 401 && statusCode !== 403;
    const [localeLoaded, setLocaleLoaded] = useState(false);

    useEffect(() => {
        let canceled = false;
        const { locale = 'fr' } = definition.intl || {};
        (locale === 'en'
            ? import('@panneau/intl/locale/en')
            : import('@panneau/intl/locale/fr')
        ).then(() => {
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

export default PanneauContainer;
