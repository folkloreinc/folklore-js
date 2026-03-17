import { ReactNode } from 'react';
import { type MessageDescriptor, useIntl } from 'react-intl';

import { isMessage } from '../../lib/utils';

function PageMeta({ title = null }: { title: ReactNode | MessageDescriptor | null }) {
    const intl = useIntl();
    return (
        <>
            <title>{isMessage(title) ? intl.formatMessage(title) : title}</title>
        </>
    );
}

export default PageMeta;
