export default function generatePath(path, data) {
    const RGX = /(\/|^)([:*][^/]*?)(\?)?(?=[/.]|$)/g;

    return path.replace(RGX, (x, lead, key, optional) => {
        const newX = data[key === '*' ? key : key.replace(/^:([^(]+)(?=\()?.*$/, '$1')] || null;
        if (newX !== null) {
            return `/${newX}`;
        }
        return optional || key === '*' ? '' : `/${key}`;
    });
}
