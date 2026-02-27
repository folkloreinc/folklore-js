import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';

import { isMessage } from '../../lib/utils';

function PageMeta({ title = null }: { title: string | object | null }) {
    const intl = useIntl();
    return (
        <Helmet>
            <title>{isMessage(title) ? intl.formatMessage(title) : title}</title>
        </Helmet>
    );
}

export default PageMeta;
