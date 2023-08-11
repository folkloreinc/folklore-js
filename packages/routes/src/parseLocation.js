export default function parseLocation(location, search = null, hash = null) {
    const [pathname, searchFromPath = null] = (location || '').split('?', 2);
    const [searchWithoutHash, hashFromPath = null] = (searchFromPath || '').split('#', 2);
    return {
        pathname: pathname !== '' ? pathname : '/',
        search: search || searchWithoutHash || null,
        hash: hash || hashFromPath || null,
    };
}
