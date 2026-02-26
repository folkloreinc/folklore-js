type DisplayNameInput = {
    displayName?: string | null;
    name?: string | null;
};

export default function getDisplayName({
    displayName = null,
    name = null,
}: DisplayNameInput): string {
    return displayName || name || 'Component';
}
