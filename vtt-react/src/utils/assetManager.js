/**
 * Asset Manager - Handles transition from WoW icons to custom game assets
 * 
 * This utility provides a centralized way to manage game assets and 
 * gradually replace WoW icons with custom artwork.
 */

// Base paths for different asset types
export const ASSET_PATHS = {
  icons: {
    spells: '/assets/icons/spells/',
    items: '/assets/icons/items/',
    creatures: '/assets/icons/creatures/',
    abilities: '/assets/icons/abilities/',
    ui: '/assets/icons/ui/'
  },
  images: {
    characters: '/assets/images/characters/',
    backgrounds: '/assets/images/backgrounds/',
    textures: '/assets/images/textures/'
  },
  // Legacy WoW icon base URL for fallback
  wow: 'https://wow.zamimg.com/images/wow/icons/large/'
};

// Default fallback icons for each category
export const FALLBACK_ICONS = {
  spell: 'ui_icon_questionmark.png',
  item: 'ui_icon_questionmark.png', 
  creature: 'ui_icon_questionmark.png',
  ability: 'ui_icon_questionmark.png',
  ui: 'ui_icon_questionmark.png'
};

/**
 * Get icon URL with fallback system
 * @param {string} iconId - Icon identifier
 * @param {string} category - Icon category (spell, item, creature, ability, ui)
 * @param {boolean} useCustom - Whether to try custom icons first
 * @returns {string} - Full URL to icon
 */
export const getIconUrl = (iconId, category = 'ui', useCustom = true) => {
  if (!iconId) {
    return getCustomIconUrl(FALLBACK_ICONS[category] || FALLBACK_ICONS.ui, category);
  }

  if (useCustom) {
    // Try custom icon first
    const customUrl = getCustomIconUrl(iconId, category);
    return customUrl;
  } else {
    // Use WoW icon as fallback
    return getWowIconUrl(iconId);
  }
};

/**
 * Get custom icon URL
 * @param {string} iconId - Icon identifier  
 * @param {string} category - Icon category
 * @returns {string} - URL to custom icon
 */
export const getCustomIconUrl = (iconId, category) => {
  const basePath = ASSET_PATHS.icons[category] || ASSET_PATHS.icons.ui;
  
  // Ensure .png extension
  const fileName = iconId.endsWith('.png') ? iconId : `${iconId}.png`;
  
  return `${basePath}${fileName}`;
};

/**
 * Get WoW icon URL (legacy fallback)
 * @param {string} iconId - WoW icon identifier
 * @returns {string} - URL to WoW icon
 */
export const getWowIconUrl = (iconId) => {
  return `${ASSET_PATHS.wow}${iconId}.jpg`;
};

/**
 * Check if custom icon exists
 * @param {string} iconId - Icon identifier
 * @param {string} category - Icon category
 * @returns {Promise<boolean>} - Whether custom icon exists
 */
export const customIconExists = async (iconId, category) => {
  try {
    const url = getCustomIconUrl(iconId, category);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Smart icon loader with fallback chain
 * @param {string} iconId - Icon identifier
 * @param {string} category - Icon category
 * @returns {Promise<string>} - Final icon URL to use
 */
export const loadIconWithFallback = async (iconId, category = 'ui') => {
  if (!iconId) {
    return getCustomIconUrl(FALLBACK_ICONS[category], category);
  }

  // Try custom icon first
  const customExists = await customIconExists(iconId, category);
  if (customExists) {
    return getCustomIconUrl(iconId, category);
  }

  // Try WoW icon as fallback
  try {
    const wowUrl = getWowIconUrl(iconId);
    const response = await fetch(wowUrl, { method: 'HEAD' });
    if (response.ok) {
      return wowUrl;
    }
  } catch (error) {
    // WoW icon failed, use fallback
  }

  // Use fallback icon
  return getCustomIconUrl(FALLBACK_ICONS[category], category);
};

/**
 * Batch preload icons for better performance
 * @param {Array} iconList - Array of {iconId, category} objects
 * @returns {Promise<Object>} - Map of iconId to final URL
 */
export const preloadIcons = async (iconList) => {
  const iconMap = {};
  
  const promises = iconList.map(async ({ iconId, category }) => {
    const url = await loadIconWithFallback(iconId, category);
    iconMap[iconId] = url;
  });

  await Promise.all(promises);
  return iconMap;
};

/**
 * Migration helper - convert WoW icon ID to custom icon name
 * @param {string} wowIconId - WoW icon identifier
 * @param {string} category - Target category
 * @returns {string} - Suggested custom icon name
 */
export const convertWowIconToCustom = (wowIconId, category) => {
  // Remove common WoW prefixes and convert to custom naming
  const cleanId = wowIconId
    .replace(/^(inv_|spell_|ability_)/, '')
    .replace(/_/g, '_')
    .toLowerCase();
  
  return `${category}_${cleanId}`;
};

// Export for backward compatibility
export default {
  getIconUrl,
  getCustomIconUrl,
  getWowIconUrl,
  loadIconWithFallback,
  preloadIcons,
  customIconExists,
  convertWowIconToCustom,
  ASSET_PATHS,
  FALLBACK_ICONS
};
