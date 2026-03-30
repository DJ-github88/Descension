/**
 * Utility to dynamically load all icons from the items folder structure
 * This allows us to include all 3000+ icons without manually listing them
 */

import { getIconUrl } from './assetManager';

/**
 * Generate icon entries from a folder path
 * @param {string} basePath - Base path like 'Food/Fruit'
 * @param {string[]} fileNames - Array of file names (without .png)
 * @returns {Array} Array of {id, name} objects
 */
export const generateIconEntries = (basePath, fileNames) => {
  return fileNames.map(fileName => {
    // Convert filename to readable name
    const name = fileName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      id: `${basePath}/${fileName}`,
      name: name
    };
  });
};

/**
 * Load icons dynamically from the items folder
 * This is a placeholder - in production, you'd fetch this from a generated JSON file
 * or use a build-time script to generate the icon list
 */
export const loadAllIcons = async () => {
  // In a real implementation, this would fetch from a generated JSON file
  // or use a build script to generate the icon list at build time
  // For now, we'll use the static WOW_ICONS but expanded
  return null;
};

