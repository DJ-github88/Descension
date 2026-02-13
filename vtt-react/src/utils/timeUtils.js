/**
 * Time Utilities
 */

/**
 * Formats a timestamp as a "time ago" string (e.g. "5m ago", "2h ago")
 * @param {number|Date|string} timestamp - The timestamp to format
 * @returns {string} - Formatted string
 */
export const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';

    const now = Date.now();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(months / 12);
    return `${years}y ago`;
};
