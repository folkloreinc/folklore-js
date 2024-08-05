import Cookies from 'js-cookie';

export const getXSRFToken = (cookieName = null) => {
    const cookies = Cookies.get();
    return (cookieName !== null ? cookies[cookieName] : null) || cookies['XSRF-TOKEN'] || null;
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

export const getCSRFHeaders = ({ csrfMetaName = null, xsrfCookieName = null } = {}) => {
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
