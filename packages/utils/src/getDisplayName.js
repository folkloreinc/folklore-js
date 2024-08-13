export default function getDisplayName({ displayName = null, name = null }) {
    return displayName || name || 'Component';
}
