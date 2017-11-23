import reduce from 'lodash/reduce';

class UrlGenerator {
    constructor(routes, opts) {
        this.routes = routes;
        this.options = {
            paramFormat: ':{key}',
            ...opts,
        };
    }

    route(key, opts) {
        const options = {
            withHost: false,
            ...this.options,
            ...opts,
        };
        const { withHost, paramFormat, ...params } = options;
        const route = this.routes[key] || key;
        const url = reduce(params || {}, (str, v, k) => (
            str.replace(paramFormat.replace(/\{\s*key\s*\}/gi, k), v)
        ), route);

        if (withHost) {
            return url;
        }

        const host = typeof window !== 'undefined' ? `^${window.location.protocol}//${window.location.host}` : '^$';
        const urlWithoutHost = url.replace(new RegExp(host, 'i'), '');
        return urlWithoutHost === '' ? '/' : urlWithoutHost;
    }
}

export default UrlGenerator;
