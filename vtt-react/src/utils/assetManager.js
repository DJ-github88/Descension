/**
 * Asset Manager - Handles custom game assets
 * 
 * This utility provides a centralized way to manage game assets using
 * local custom artwork from the items folder.
 */

import { convertWowIconToLocal } from './wowToLocalIconMap';

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
  item: 'Misc/Books/book-brown-teal-question-mark', // Local item fallback
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

  // For abilities category, use getAbilityIconUrl which handles creature- prefix
  if (category === 'abilities') {
    return getAbilityIconUrl(iconId);
  }

  // For items category, always use local assets only - no WoW fallback
  if (category === 'items') {
    // If it's a WoW-style icon ID, try to map it to a local icon
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('trade_')) {
      const localIconId = convertWowIconToLocal(iconId);
      if (localIconId) {
        // Use mapped local icon
        return getCustomIconUrl(localIconId, category);
      }
      // If no mapping found, use fallback icon
      return getCustomIconUrl(FALLBACK_ICONS.item, category);
    }
    // Use the iconId directly (should be a path like "Weapons/Sword/iron-sword" or "Misc/Books/book-brown-teal-question-mark")
    return getCustomIconUrl(iconId, category);
  }

  if (useCustom) {
    // Try custom icon first
    const customUrl = getCustomIconUrl(iconId, category);
    return customUrl;
  } else {
    // Use WoW icon as fallback (only for non-items)
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
  
  // URL encode the path to handle spaces and special characters
  // Split by '/' to encode each segment separately, then rejoin
  const pathSegments = fileName.split('/');
  const encodedPath = pathSegments.map(segment => encodeURIComponent(segment)).join('/');
  
  return `${basePath}${encodedPath}`;
};

/**
 * Map WoW spell/ability icon IDs to local ability icon paths
 * @param {string} wowIconId - WoW icon identifier (e.g., 'spell_frost_frostarmor')
 * @returns {string|null} - Local ability icon path or null if no mapping exists
 */
const convertWowIconToAbilityIcon = (wowIconId) => {
  if (!wowIconId || typeof wowIconId !== 'string') {
    return null;
  }

  // Mapping of WoW icon IDs to local ability icon paths
  const iconMapping = {
    // Frost icons
    'spell_frost_frostarmor': 'Frost/Frozen in Ice',
    'spell_frost_frostarmor02': 'Frost/Frozen in Ice',
    'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
    'spell_frost_chainsofice': 'Frost/Frozen in Ice',
    
    // Fire icons
    'spell_fire_fireball02': 'Fire/Swirling Fireball',
    'spell_fire_flamebolt': 'Fire/Flame Burst',
    'spell_fire_selfdestruct': 'Utility/Explosive Detonation',
    
    // Arcane icons
    'spell_arcane_blast': 'Arcane/Magical Sword',
    'spell_arcane_arcane04': 'Arcane/Magical Sword',
    'spell_arcane_portaldalaran': 'Utility/Utility',
    'spell_arcane_teleportundercity': 'Utility/Utility',
    'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
    
    // Shadow/Necrotic icons
    'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
    'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',
    'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
    'spell_shadow_summoninfernal': 'Utility/Summon Minion',
    
    // Holy/Radiant icons
    'spell_holy_holysmite': 'Radiant/Divine Blessing',
    'spell_holy_divineillumination': 'Radiant/Divine Blessing',
    'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',
    'spell_holy_greaterheal': 'Healing/Golden Heart',
    'spell_holy_heal02': 'Healing/Golden Heart',
    'spell_holy_flashheal': 'Healing/Golden Heart',
    'spell_holy_renew': 'Healing/Renewal',
    'spell_holy_devotion': 'Radiant/Divine Blessing',
    'spell_holy_devotionaura': 'Radiant/Divine Blessing',
    
    // Nature/Lightning icons
    'spell_nature_lightning': 'Lightning/Lightning Bolt',
    
    // Ability icons
    'ability_warrior_rampage': 'Utility/Empowered Warrior',
    'ability_warrior_battleshout': 'Utility/Powerful Warrior',
    'ability_warrior_intensifyrage': 'Utility/Empowered Warrior',
    'ability_druid_catform': 'Utility/Utility',
    
    // Misc icons
    'inv_misc_questionmark': 'Utility/Utility',
    'inv_misc_book_07': 'Utility/Utility',
    'inv_misc_bag_08': 'Utility/Utility',
  };

  return iconMapping[wowIconId] || null;
};

/**
 * Get ability icon URL
 * @param {string} iconId - Icon identifier (can be a path like "Utility/Icon Name" or "combat/sword" or legacy WoW icon ID)
 * @returns {string} - URL to ability icon
 */
export const getAbilityIconUrl = (iconId) => {
  if (!iconId) {
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // If iconId already contains a path (e.g., "Utility/Icon Name" or "combat/sword")
  if (iconId.includes('/') && !iconId.startsWith('http')) {
    // Check if it already has the creature- prefix
    const pathParts = iconId.split('/');
    const fileName = pathParts[pathParts.length - 1];
    if (fileName.startsWith('creature-')) {
      // Already has prefix, use as-is
      return getCustomIconUrl(iconId, 'abilities');
    }
    
    // First, try the path as-is (for properly formatted paths like "Utility/Icon Name")
    // This handles paths that are already correctly formatted
    const directPath = getCustomIconUrl(iconId, 'abilities');
    
    // For backwards compatibility with lowercase folder names (e.g., "utility/icon-name"),
    // try adding the creature- prefix only if the folder is lowercase
    const folder = pathParts[0];
    const rest = pathParts.slice(1).join('/');
    
    // If folder is capitalized (e.g., "Utility"), use path as-is
    if (folder[0] === folder[0].toUpperCase()) {
      return directPath;
    }
    
    // For lowercase folders (legacy creature ability paths), add creature- prefix
    // combat/demonic-warrior -> combat/creature-combat-demonic-warrior
    const prefixedPath = `${folder}/creature-${folder}-${rest}`;
    return getCustomIconUrl(prefixedPath, 'abilities');
  }

  // If it's a legacy WoW icon ID (starts with inv_, spell_, ability_, etc.), 
  // try to map it to an ability icon
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    // First, try the mapping function
    const mappedIcon = convertWowIconToAbilityIcon(iconId);
    if (mappedIcon) {
      return getCustomIconUrl(mappedIcon, 'abilities');
    }
    
    // If no mapping found, use a safe local fallback to prevent flickering
    // Use Utility/Utility as the default fallback instead of trying to construct paths
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // Otherwise, try to find the icon in common subfolders
  // Try combat first as it's most common for creature icons
  // Add creature- prefix
  return getCustomIconUrl(`combat/creature-combat-${iconId}`, 'abilities');
};

/**
 * Get WoW icon URL (legacy fallback)
 * @param {string} iconId - WoW icon identifier
 * @returns {string} - URL to WoW icon
 */
export const getWowIconUrl = (iconId) => {
  // In development, use proxy to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    return `/api/wow-icons/${iconId}.jpg`;
  }
  // In production, use direct URL
  return `${ASSET_PATHS.wow}${iconId}.jpg`;
};

/**
 * Get a default creature icon based on creature type
 * @param {string} creatureType - The type of creature (e.g., 'dragon', 'humanoid', 'undead')
 * @returns {string} - Default creature icon path
 */
export const getDefaultCreatureIconByType = (creatureType) => {
  const typeToIconMap = {
    'dragon': 'Demon/Icon1',
    'humanoid': 'Human/Icon1',
    'undead': 'Undead/Icon1',
    'beast': 'Monsters/Icon1',
    'fiend': 'Demon/Icon1',
    'fey': 'Fairy/Icon1',
    'aberration': 'Monsters/Icon1',
    'celestial': 'Elves/Icon1',
    'construct': 'Dwarf/Icon1',
    'elemental': 'Monsters/Icon1',
    'giant': 'Dwarf/Icon1',
    'monstrosity': 'Monsters/Icon1',
    'ooze': 'Monsters/Icon1',
    'plant': 'Monsters/Icon1'
  };
  
  return typeToIconMap[creatureType?.toLowerCase()] || 'Human/Icon1';
};

/**
 * Get creature token icon URL - handles both creature icon paths and legacy WoW icons
 * @param {string} iconId - Icon identifier (can be creature path like "Dark Elf/Icon1" or WoW icon ID)
 * @param {string} creatureType - Optional creature type for fallback icon selection
 * @returns {string} - URL to creature icon
 */
export const getCreatureTokenIconUrl = (iconId, creatureType = null) => {
  // Handle null, undefined, or empty string - use a default creature icon based on type
  if (!iconId || (typeof iconId === 'string' && iconId.trim() === '')) {
    const defaultIcon = getDefaultCreatureIconByType(creatureType);
    const url = getCustomIconUrl(defaultIcon, 'creatures');
    return url;
  }

  // Known creature icon folders - these are actual creature icon paths
  const creatureFolders = [
    'Dark Elf', 'Demon', 'Dwarf', 'Elves', 'Fairy', 'Halfling', 'Human', 
    'Kobolds', 'Monsters', 'More Demons', 'More Elves', 'More Humans', 
    'More Monsters', 'More Undead', 'Orc and Goblins', 'Pirates', 'Undead'
  ];
  
  // Known ability icon folders - these should be converted to creature icons
  const abilityFolders = ['combat', 'defensive', 'magic', 'movement', 'social', 'utility'];
  
  // If iconId contains a '/', check if it's a creature icon or ability icon
  if (iconId.includes('/')) {
    const firstSegment = iconId.split('/')[0];
    
    // Check if it's an ability icon path (e.g., "combat/beast-paw-claws")
    // Convert it to a creature icon based on creature type
    if (abilityFolders.includes(firstSegment)) {
      // Convert ability icon to creature icon based on type
      const defaultIcon = getDefaultCreatureIconByType(creatureType);
      const url = getCustomIconUrl(defaultIcon, 'creatures');
      return url;
    }
    
    // Check if it's a known creature folder (e.g., "Dark Elf/Icon1", "Human/Icon1")
    if (creatureFolders.some(folder => iconId.startsWith(folder + '/'))) {
      const url = getCustomIconUrl(iconId, 'creatures');
      return url;
    }
    
    // Unknown path structure - try as creature icon first, fallback to default
    const url = getCustomIconUrl(iconId, 'creatures');
    return url;
  }

  // If it's a legacy WoW icon ID, use a creature icon fallback instead
  // This ensures all creatures show creature icons, not WoW icons
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    const defaultIcon = getDefaultCreatureIconByType(creatureType);
    const url = getCustomIconUrl(defaultIcon, 'creatures');
    return url;
  }

  // Otherwise, try as ability icon (for backwards compatibility)
  // But fall back to a creature icon if it's not a valid ability icon path
  if (iconId.includes('/')) {
    return getAbilityIconUrl(iconId);
  }
  
  // Final fallback to creature icon
  const defaultIcon = getDefaultCreatureIconByType(creatureType);
  const url = getCustomIconUrl(defaultIcon, 'creatures');
  return url;
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

  // For items category, never use WoW icons - only use local fallback
  if (category === 'items') {
    return getCustomIconUrl('Misc/Books/book-brown-teal-question-mark', category);
  }

  // Try WoW icon as fallback (only for non-items)
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
  getAbilityIconUrl,
  getCreatureTokenIconUrl,
  getDefaultCreatureIconByType,
  loadIconWithFallback,
  preloadIcons,
  customIconExists,
  convertWowIconToCustom,
  ASSET_PATHS,
  FALLBACK_ICONS
};
