/**
 * Format a timestamp into a human-readable string
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted time string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  
  // Check if the timestamp is from today
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    // Format as time only for today's timestamps
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    // Format with date for older timestamps
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    }) + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};
