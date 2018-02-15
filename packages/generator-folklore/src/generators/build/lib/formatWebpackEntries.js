import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';

const tab = number => ' '.repeat(4 * number);
const formatWebpackEntries = (entries) => {
    if (entries === null) {
        return null;
    }
    const lines = [];
    if (isArray(entries)) {
        lines.push('entry: [');
        entries.forEach((entry) => {
            lines.push(`${tab(3)}'${entry}',`);
        });
        lines.push(`${tab(2)}],`);
    } else if (isObject(entries)) {
        lines.push('entry: {');
        Object.keys(entries).forEach((key) => {
            lines.push(`${tab(3)}${key}: ${JSON.stringify(entries[key]).replace(/"/gi, "'").replace(/','/gi, "', '")},`);
        });
        lines.push(`${tab(2)}},`);
    } else {
        lines.push(`entry: ${JSON.stringify(entries, null, 4).replace(/"/gi, "'")},`);
    }
    return lines.join('\n');
};

export default formatWebpackEntries;
