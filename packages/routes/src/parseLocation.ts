export type ParsedLocation = {
    pathname: string;
    search: string | null;
    hash: string | null;
};

export default function parseLocation(
    location: string | null | undefined,
    search: string | null = null,
    hash: string | null = null,
): ParsedLocation {
    const [pathname, searchFromPath = null] = (location || '').split('?', 2);
    const [searchWithoutHash, hashFromPath = null] = (searchFromPath || '').split('#', 2);
    return {
        pathname: pathname !== '' ? pathname : '/',
        search: search || searchWithoutHash || null,
        hash: hash || hashFromPath || null,
    };
}
