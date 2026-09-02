export function formatDuration(seconds: number | null): string | null {
    if (seconds === null) {
        return null;
    }
    const parts = [];
    const hours = Math.floor(seconds / (60 * 60));
    if (hours > 0) {
        parts.push(hours);
    }
    const minutes = Math.floor((seconds - hours * (60 * 60)) / 60);
    parts.push(hours > 0 && minutes < 10 ? `0${minutes}` : minutes);
    const remainingSeconds = Math.round(seconds - hours * (60 * 60) - minutes * 60);
    parts.push(remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds);
    return parts.join(':');
}

export function formatDurationIso8601(seconds: number | null): string | null {
    if (seconds === null) {
        return null;
    }
    const units = ['S', 'M', 'H'];
    return `PT${formatDuration(seconds)
        .split(':')
        .reverse()
        .map((it, index) => `${it}${units[index]}`)
        .reverse()
        .join('')}`;
}
