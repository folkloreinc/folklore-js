import Cookies from 'js-cookie';

export const getXSRFToken = () => {
    const cookies = Cookies.get();
    return cookies['XSRF-TOKEN'] || null;
};

export const getCsrfToken = (name) => {
    const metaName = name || 'csrf-token';
    if (typeof document === 'undefined') {
        return null;
    }
    const metas = [].slice.call(document.getElementsByTagName('meta'));
    return metas.reduce((val, meta) => (
        meta.getAttribute('name') === metaName ? meta.getAttribute('content') : val
    ), null);
};

export const getCSRFHeaders = (name) => {
    const XSRF = getXSRFToken();
    if (XSRF !== null) {
        return {
            'X-XSRF-TOKEN': XSRF,
        };
    }
    const CSRF = getCsrfToken(name);
    if (CSRF !== null) {
        return {
            'X-CSRF-TOKEN': CSRF,
        };
    }
    return null;
};
