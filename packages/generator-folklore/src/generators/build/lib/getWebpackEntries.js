import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

const getWebpackEntries = (webpackEntry, webpackEntries) => {
    if (webpackEntry === null && webpackEntries === null) {
        return null;
    }
    const entry = webpackEntry;
    let entries = {};
    if (entry !== null) {
        entries = {
            main: entry,
        };
    } else {
        entries = webpackEntries;
    }
    if (entries && !isObject(entries)) {
        const newEntries = {};
        if (!isArray(entries)) {
            entries = entries.length ? [entries] : [];
        }
        entries.forEach((it) => {
            const entryParts = it.split(',');
            newEntries[entryParts[0]] = entryParts.slice(1);
        });
        entries = newEntries;
    }
    return entries;
};

export default getWebpackEntries;
