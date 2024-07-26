import Cookies from 'js-cookie';

export const getXSRFToken = (xsrfName = null) => {
    const cookies = Cookies.get();
    return (xsrfName !== null ? cookies[xsrfName] : null) || cookies['XSRF-TOKEN'] || null;
};

export const getCsrfToken = (name = null) => {
    const metaName = name || 'csrf-token';
    if (typeof document === 'undefined') {
        return null;
    }
    const metas = [].slice.call(document.getElementsByTagName('meta'));
    return metas.reduce(
        (val, meta) =>
            meta.getAttribute('name') === metaName ? meta.getAttribute('content') : val,
        null,
    );
};

export const getCSRFHeaders = (csrfName = null, xsrfName = null) => {
    const XSRF = getXSRFToken(xsrfName);
    if (XSRF !== null) {
        return {
            'X-XSRF-TOKEN': XSRF,
        };
    }
    const CSRF = getCsrfToken(csrfName);
    if (CSRF !== null) {
        return {
            'X-CSRF-TOKEN': CSRF,
        };
    }
    return null;
};
