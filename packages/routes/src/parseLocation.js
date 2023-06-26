import queryString from 'query-string';

export default function parseLocation(location) {
    const [pathname, search = null] = (location || '').split('?', 2);
    const [searchWithoutHash, hash = null] = (search || '').split('#', 2);
    return {
        pathname: pathname !== '' ? pathname : '/',
        search: searchWithoutHash,
        hash,
        query: queryString.parse(searchWithoutHash || ''),
    };
}
