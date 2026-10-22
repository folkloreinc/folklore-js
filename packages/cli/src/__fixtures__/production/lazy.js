// A comment that a minified build should not keep
export default function describeItems(items) {
    const descriptions = [];
    for (let index = 0; index < items.length; index += 1) {
        const currentItem = items[index];
        descriptions.push(`${index + 1}. ${currentItem.title} (${currentItem.description})`);
    }
    return descriptions.join('\n');
}
