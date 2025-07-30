/**
 * Utility functions for working with icons in the spell crafting wizard
 */

// Base URL for WoW icons
export const WOW_ICON_BASE_URL = 'https://wow.zamimg.com/images/wow/icons/large/';

/**
 * Get the full URL for a WoW icon
 * @param {string} iconName - The icon name/ID
 * @returns {string} - The full URL to the icon
 */
export const getIconUrl = (iconName) => {
  if (!iconName) return '';
  return `${WOW_ICON_BASE_URL}${iconName}.jpg`;
};
