import Cookies from 'js-cookie';

type CSRFHeadersOptions = {
    csrfMetaName?: string | null;
    xsrfCookieName?: string | null;
};

export function getXSRFToken(cookieName: string | null = null): string | null {
    const cookies = Cookies.get();
    return (cookieName !== null ? cookies[cookieName] : null) || cookies['XSRF-TOKEN'] || null;
}

export function getCsrfToken(name: string | null = null): string | null {
    const metaName = name || 'csrf-token';
    if (typeof document === 'undefined') {
        return null;
    }
    const metas = Array.from(document.getElementsByTagName('meta'));
    return metas.reduce(
        (val: string | null, meta) =>
            meta.getAttribute('name') === metaName ? meta.getAttribute('content') : val,
        null,
    );
}

export const getCSRFHeaders = ({
    csrfMetaName = null,
    xsrfCookieName = null,
}: CSRFHeadersOptions = {}): Record<string, string> | null => {
    const XSRF = getXSRFToken(xsrfCookieName);
    if (XSRF !== null) {
        return {
            'X-XSRF-TOKEN': XSRF,
        };
    }
    const CSRF = getCsrfToken(csrfMetaName);
    if (CSRF !== null) {
        return {
            'X-CSRF-TOKEN': CSRF,
        };
    }
    return null;
};
