function formatDuration(seconds) {

    seconds = Math.floor(seconds);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (days)
        parts.push(`${days}d`);

    if (hours)
        parts.push(`${hours}h`);

    if (minutes)
        parts.push(`${minutes}m`);

    if (seconds || parts.length === 0)
        parts.push(`${seconds}s`);

    return parts.join(" ");
}

function formatTimestamp(date = new Date()) {

    return `<t:${Math.floor(date.getTime() / 1000)}:F>`;

}

function relativeTime(date = new Date()) {

    return `<t:${Math.floor(date.getTime() / 1000)}:R>`;

}

module.exports = {
    formatDuration,
    formatTimestamp,
    relativeTime
};