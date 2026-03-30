/**
 * Status Icon Loader
 * Loads icons from the Status directory structure
 */

// Status icon directory mapping
export const STATUS_ICON_DIRECTORIES = {
  'Movement': 'movement',
  'Mental': 'mental',
  'Physical': 'physical',
  'Magical': 'magical',
  'Combat': 'combat',
  'Control': 'control',
  'Buff': 'buff',
  'Debuff': 'debuff',
  'DOT': 'dot',
  'Healing': 'healing',
  'HOT': 'hot',
  'Defensive': 'defensive',
  'Utility': 'utility',
  'Other': 'other',
  'Social': 'social'
};

/**
 * Load all icons from a Status directory category
 * @param {string} categoryName - Category name (e.g., 'Movement', 'Mental')
 * @returns {Promise<Array>} Array of icon objects with {id, name, isImage}
 */
export const loadIconsFromCategory = async (categoryName) => {
  const statusDir = STATUS_ICON_DIRECTORIES[categoryName];
  
  if (!statusDir) {
    return [];
  }
  
  try {
    // Load manifest file
    const manifestPath = `/assets/icons/Status/${statusDir}/manifest.json`;
    const response = await fetch(manifestPath);
    
    if (response.ok) {
      const manifest = await response.json();
      return manifest.icons.map(icon => ({
        id: `/assets/icons/Status/${statusDir}/${icon.filename}`,
        name: icon.name || generateIconName(icon.filename),
        isImage: true
      }));
    } else {
      console.warn(`Manifest not found for ${categoryName} at ${manifestPath}`);
    }
  } catch (error) {
    console.warn(`Could not load manifest for ${categoryName}:`, error);
  }
  
  // Fallback: return empty array
  return [];
};

/**
 * Load all icons from all categories (for "All" view)
 * @returns {Promise<Array>} Array of all icon objects
 */
export const loadAllIcons = async () => {
  const allIcons = [];
  
  for (const [categoryName, statusDir] of Object.entries(STATUS_ICON_DIRECTORIES)) {
    try {
      const manifestPath = `/assets/icons/Status/${statusDir}/manifest.json`;
      const response = await fetch(manifestPath);
      
      if (response.ok) {
        const manifest = await response.json();
        const icons = manifest.icons.map(icon => ({
          id: `/assets/icons/Status/${statusDir}/${icon.filename}`,
          name: icon.name || generateIconName(icon.filename),
          isImage: true,
          category: categoryName
        }));
        allIcons.push(...icons);
      }
    } catch (error) {
      console.warn(`Could not load icons for ${categoryName}:`, error);
    }
  }
  
  return allIcons;
};

/**
 * Generate a readable name from filename
 * @param {string} filename - Icon filename
 * @returns {string} Readable name
 */
export const generateIconName = (filename) => {
  return filename
    .replace('.png', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

