/**
 * Utility functions for working with icons in the spell crafting wizard
 */

import assetManager from '../../../utils/assetManager';

// Base URL for WoW icons (legacy fallback)
export const WOW_ICON_BASE_URL = 'https://wow.zamimg.com/images/wow/icons/large/';

/**
 * Get the full URL for a spell icon with custom asset support
 * @param {string} iconName - The icon name/ID
 * @param {boolean} useCustom - Whether to try custom icons first (default: true)
 * @returns {string} - The full URL to the icon
 */
export const getIconUrl = (iconName, useCustom = true) => {
  if (!iconName) return '';

  if (useCustom) {
    // Use new asset manager for custom icons with WoW fallback
    return assetManager.getIconUrl(iconName, 'spell', true);
  } else {
    // Legacy WoW icon URL
    return `${WOW_ICON_BASE_URL}${iconName}.jpg`;
  }
};

/**
 * Get WoW icon URL (legacy support)
 * @param {string} iconName - The WoW icon name/ID
 * @returns {string} - The full URL to the WoW icon
 */
export const getWowIconUrl = (iconName) => {
  if (!iconName) return '';
  return `${WOW_ICON_BASE_URL}${iconName}.jpg`;
};

/**
 * Get custom spell icon URL
 * @param {string} iconName - The custom icon name
 * @returns {string} - The full URL to the custom icon
 */
export const getCustomIconUrl = (iconName) => {
  if (!iconName) return '';
  return assetManager.getCustomIconUrl(iconName, 'spell');
};
