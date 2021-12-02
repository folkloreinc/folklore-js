const getAppEnv = ({ source = process.env, pattern = /^FLKLR_APP_/, extra = null } = {}) =>
    Object.keys(source)
        .filter((key) => pattern === null || pattern.test(key))
        .reduce(
            (map, key) => ({
                ...map,
                [pattern !== null ? key.replace(pattern, '') : pattern]: process.env[key],
            }),
            {
                NODE_ENV: source.NODE_ENV || 'development',
                ...(extra !== null
                    ? extra.reduce(
                          (map, key) => ({
                              ...map,
                              [key]: source[key] || null,
                          }),
                          {},
                      )
                    : null),
            },
        );

export default getAppEnv;
