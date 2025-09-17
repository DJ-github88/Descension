/**
 * Spell Library Manager
 *
 * Utility functions for managing the spell library storage, searching,
 * filtering, sorting, and performing other library management tasks.
 */
import { serializeSpell, deserializeSpell } from './spellSerializer';

// Constants
const LIBRARY_STORAGE_KEY = 'spell_library_data';
const LIBRARY_VERSION = 1; // For future migrations

/**
 * Clear the library from localStorage - useful for forcing a reload of default spells
 */
export function clearLibraryFromStorage() {
  try {
    console.log('Clearing library from localStorage');
    localStorage.removeItem(LIBRARY_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing library from storage:', error);
    return false;
  }
}

/**
 * Save the entire library to localStorage
 */
export function saveLibraryToStorage(library) {
  try {
    // Debug log to see what's being saved
    // console.log('Saving library to storage:', library);

    const libraryData = {
      version: LIBRARY_VERSION,
      timestamp: new Date().toISOString(),
      data: library
    };

    // Ensure we're not trying to save null or undefined
    if (!library) {
      console.error('Attempted to save null or undefined library');
      return false;
    }

    // Ensure spells array exists
    if (!library.spells) {
      console.error('Library has no spells array');
      library.spells = [];
    }

    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(libraryData));

    // Verify the data was saved correctly
    const savedData = localStorage.getItem(LIBRARY_STORAGE_KEY);
    // console.log('Saved data size:', savedData ? savedData.length : 0, 'bytes');

    return true;
  } catch (error) {
    console.error('Error saving library to storage:', error);
    return false;
  }
}

/**
 * Load the library from localStorage
 */
export function loadLibraryFromStorage() {
  try {
    const data = localStorage.getItem(LIBRARY_STORAGE_KEY);

    if (!data) {
      console.log('No library found in storage, returning empty library');
      return getDefaultLibrary();
    }

    // console.log('Found library in storage, size:', data.length, 'bytes');

    const libraryData = JSON.parse(data);

    // Handle version migrations if needed
    if (libraryData.version < LIBRARY_VERSION) {
      const migratedData = migrateLibraryVersion(libraryData).data;
      return validateLibraryIntegrity(migratedData);
    }

    // Ensure the data structure is valid
    if (!libraryData.data) {
      console.error('Invalid library data structure, missing data property');
      return getDefaultLibrary();
    }

    // Validate and fix any integrity issues
    return validateLibraryIntegrity(libraryData.data);
  } catch (error) {
    console.error('Error loading library from storage:', error);
    return getDefaultLibrary();
  }
}

/**
 * Export the library in the specified format
 */
export function exportLibrary(library, format = 'json') {
  try {
    switch (format) {
      case 'json':
        const exportData = {
          version: LIBRARY_VERSION,
          timestamp: new Date().toISOString(),
          data: library
        };

        return JSON.stringify(exportData, null, 2);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Error exporting library:', error);
    return null;
  }
}

/**
 * Import a library from external data
 */
export function importLibrary(data) {
  try {
    let libraryData;

    // If string, parse it as JSON
    if (typeof data === 'string') {
      libraryData = JSON.parse(data);
    } else {
      libraryData = data;
    }

    // Validate the imported data
    if (!libraryData || !libraryData.data) {
      throw new Error('Invalid library data format');
    }

    // Handle version migrations if needed
    if (libraryData.version < LIBRARY_VERSION) {
      libraryData = migrateLibraryVersion(libraryData);
    }

    // Validate and fix integrity issues
    return validateLibraryIntegrity(libraryData.data);
  } catch (error) {
    console.error('Error importing library:', error);
    return null;
  }
}

/**
 * Search spells by name and description
 */
export function searchSpells(library, query) {
  if (!query || query.trim() === '') {
    return library.spells;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return library.spells.filter(spell => {
    const nameMatch = spell.name && spell.name.toLowerCase().includes(normalizedQuery);
    const descMatch = spell.description && spell.description.toLowerCase().includes(normalizedQuery);

    return nameMatch || descMatch;
  });
}

/**
 * Apply filters to the spell library
 */
export function filterSpells(library, filters) {
  let filteredSpells = [...library.spells];

  // Apply text search filter
  if (filters.query) {
    filteredSpells = searchSpells({ spells: filteredSpells }, filters.query);
  }

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    filteredSpells = filteredSpells.filter(spell => {
      // If no categories are assigned, it should be in 'uncategorized'
      const spellCategories = spell.categoryIds || ['uncategorized'];

      // Check if any of the spell's categories match the filter categories
      return filters.categories.some(catId => spellCategories.includes(catId));
    });
  }

  // Filter by spell levels
  if (filters.levels && filters.levels.length > 0) {
    filteredSpells = filteredSpells.filter(spell => {
      return filters.levels.includes(spell.level);
    });
  }

  // Filter by effect types
  if (filters.effectTypes && filters.effectTypes.length > 0) {
    filteredSpells = filteredSpells.filter(spell => {
      return spell.effectTypes &&
        filters.effectTypes.some(effect => spell.effectTypes.includes(effect));
    });
  }

  // Filter by spell types
  if (filters.spellTypes && filters.spellTypes.length > 0) {
    filteredSpells = filteredSpells.filter(spell => {
      return filters.spellTypes.includes(spell.spellType);
    });
  }

  // Filter by damage types
  if (filters.damageTypes && filters.damageTypes.length > 0) {
    filteredSpells = filteredSpells.filter(spell => {
      // Check if the spell has any of the selected damage types
      if (!spell.damageTypes || !Array.isArray(spell.damageTypes)) return false;
      return filters.damageTypes.some(damageType => spell.damageTypes.includes(damageType));
    });
  }

  return filteredSpells;
}

/**
 * Sort spells based on the given criteria
 */
export function sortSpells(spells, sortOrder) {
  const { field, direction } = sortOrder;

  return [...spells].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;

      case 'level':
        comparison = (a.level || 0) - (b.level || 0);
        break;

      case 'dateCreated':
        comparison = new Date(a.dateCreated) - new Date(b.dateCreated);
        break;

      case 'lastModified':
        comparison = new Date(a.lastModified) - new Date(b.lastModified);
        break;

      default:
        // Default sort by name
        comparison = a.name.localeCompare(b.name);
    }

    // Reverse for descending order
    return direction === 'desc' ? -comparison : comparison;
  });
}

/**
 * Generate a unique ID for spells or categories
 */
export function generateUniqueId(prefix = 'spell_') {
  return prefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Determine appropriate categories for a spell based on its properties
 * Updated to only use the 6 essential categories + general actions
 */
export function categorizeSpell(spell) {
  const categories = ['uncategorized']; // Start with uncategorized as default
  const validCategories = ['uncategorized', 'favorites', 'offensive', 'defensive', 'utility', 'healing', 'general_actions', 'general_reactions', 'general_skills', 'general_enhancements'];

  // Handle general spells first
  if (spell.source === 'general' || (spell.tags && spell.tags.includes('general'))) {
    // Remove uncategorized for general spells
    categories.splice(0, 1);

    // Categorize based on spell type and tags
    if (spell.spellType === 'REACTION') {
      categories.push('general_reactions');
    } else if (spell.tags && spell.tags.includes('skill')) {
      categories.push('general_skills');
    } else if (spell.tags && spell.tags.includes('enhancement')) {
      categories.push('general_enhancements');
    } else {
      categories.push('general_actions');
    }

    return categories;
  }

  // Check for damage types - all damage types now go to 'offensive'
  if (spell.damageTypes && spell.damageTypes.length > 0) {
    categories.push('offensive');
  }

  // Check for tags - map all damage-related tags to offensive
  if (spell.tags && spell.tags.length > 0) {
    spell.tags.forEach(tag => {
      const tagLower = tag.toLowerCase();

      // Map all damage type tags to offensive
      if (tagLower.includes('acid') ||
          tagLower.includes('cold') ||
          tagLower.includes('frost') ||
          tagLower.includes('fire') ||
          tagLower.includes('force') ||
          tagLower.includes('lightning') ||
          tagLower.includes('thunder') ||
          tagLower.includes('necrotic') ||
          tagLower.includes('poison') ||
          tagLower.includes('psychic') ||
          tagLower.includes('radiant') ||
          tagLower.includes('physical') ||
          tagLower.includes('bludgeoning') ||
          tagLower.includes('piercing') ||
          tagLower.includes('slashing')) {
        categories.push('offensive');
      }

      // Map effect tags
      if (tagLower.includes('damage') || tagLower.includes('attack')) {
        categories.push('offensive');
      } else if (tagLower.includes('heal') || tagLower.includes('cure')) {
        categories.push('healing');
      } else if (tagLower.includes('buff') || tagLower.includes('protect') || tagLower.includes('shield')) {
        categories.push('defensive');
      } else if (tagLower.includes('debuff') || tagLower.includes('weaken') || tagLower.includes('curse')) {
        categories.push('offensive');
      } else if (tagLower.includes('utility') || tagLower.includes('tool')) {
        categories.push('utility');
      } else if (tagLower.includes('control') || tagLower.includes('stun') || tagLower.includes('paralyze')) {
        categories.push('utility');
      } else if (tagLower.includes('summon') || tagLower.includes('conjure') || tagLower.includes('create')) {
        categories.push('utility');
      } else if (tagLower.includes('transform') || tagLower.includes('polymorph') || tagLower.includes('shape')) {
        categories.push('utility');
      }
    });
  }

  // Check for effect types
  if (spell.effectType === 'damage' || spell.primaryDamage) {
    categories.push('offensive');
  }

  if (spell.effectType === 'healing' || spell.healing) {
    categories.push('healing');
  }

  if (spell.buffConfig || (spell.tags && spell.tags.some(tag => tag.toLowerCase().includes('buff')))) {
    categories.push('defensive');
  }

  if (spell.debuffConfig || (spell.tags && spell.tags.some(tag => tag.toLowerCase().includes('debuff')))) {
    categories.push('offensive');
  }

  if (spell.utilityEffects && spell.utilityEffects.length > 0) {
    categories.push('utility');
  }

  if (spell.controlEffects && spell.controlEffects.length > 0) {
    categories.push('utility');
  }

  // Check spell name for additional clues - map all damage types to offensive
  const nameLower = spell.name ? spell.name.toLowerCase() : '';
  if (nameLower.includes('acid') ||
      nameLower.includes('corrode') ||
      nameLower.includes('cold') ||
      nameLower.includes('frost') ||
      nameLower.includes('ice') ||
      nameLower.includes('fire') ||
      nameLower.includes('flame') ||
      nameLower.includes('burn') ||
      nameLower.includes('force') ||
      nameLower.includes('lightning') ||
      nameLower.includes('thunder') ||
      nameLower.includes('shock') ||
      nameLower.includes('necrotic') ||
      nameLower.includes('death') ||
      nameLower.includes('poison') ||
      nameLower.includes('venom') ||
      nameLower.includes('psychic') ||
      nameLower.includes('mind') ||
      nameLower.includes('radiant') ||
      nameLower.includes('holy')) {
    categories.push('offensive');
  }

  // Filter out any categories that are not in our valid list
  const filteredCategories = categories.filter(cat => validCategories.includes(cat));

  // Remove duplicates and uncategorized if we have other categories
  const uniqueCategories = [...new Set(filteredCategories)];
  if (uniqueCategories.length > 1 && uniqueCategories.includes('uncategorized')) {
    return uniqueCategories.filter(cat => cat !== 'uncategorized');
  }

  return uniqueCategories;
}

/**
 * Validate library integrity and fix issues
 */
export function validateLibraryIntegrity(library) {
  // Create a copy of the library for validation
  const validatedLibrary = { ...library };

  // Initialize empty arrays if not present
  validatedLibrary.spells = validatedLibrary.spells || [];
  validatedLibrary.categories = validatedLibrary.categories || createDefaultCategories();

  // Ensure all default categories exist
  const defaultCategories = createDefaultCategories();
  const existingCategoryIds = validatedLibrary.categories.map(cat => cat.id);

  defaultCategories.forEach(defaultCat => {
    if (!existingCategoryIds.includes(defaultCat.id)) {
      validatedLibrary.categories.push(defaultCat);
    }
  });

  // Remove categories that are not in the default list (keeping only the 6 essential categories)
  const validCategoryIds = defaultCategories.map(cat => cat.id);
  validatedLibrary.categories = validatedLibrary.categories.filter(cat =>
    validCategoryIds.includes(cat.id)
  );

  // Recategorize all spells to use only the valid categories
  validatedLibrary.spells.forEach(spell => {
    // Recategorize all spells to use only the valid categories
    spell.categoryIds = categorizeSpell(spell);
  });

  // Validate each spell
  validatedLibrary.spells = validatedLibrary.spells.map(spell => {
    // Ensure each spell has necessary properties
    const validatedSpell = {
      ...spell,
      id: spell.id || generateUniqueId(),
      name: spell.name || 'Unnamed Spell',
      dateCreated: spell.dateCreated || new Date().toISOString(),
      lastModified: spell.lastModified || new Date().toISOString(),
      categoryIds: spell.categoryIds || ['uncategorized']
    };

    // Ensure all categoryIds exist and are valid
    const validSpellCategoryIds = validatedSpell.categoryIds.filter(catId =>
      validCategoryIds.includes(catId)
    );

    // If no valid categories, assign to 'uncategorized'
    if (validSpellCategoryIds.length === 0) {
      validSpellCategoryIds.push('uncategorized');
    }

    validatedSpell.categoryIds = validSpellCategoryIds;

    return validatedSpell;
  });

  // Initialize default filters and sort if not present
  validatedLibrary.filters = validatedLibrary.filters || {
    query: '',
    categories: [],
    levels: [],
    effectTypes: [],
    spellTypes: [],
    damageTypes: []
  };

  validatedLibrary.sortOrder = validatedLibrary.sortOrder || {
    field: 'lastModified',
    direction: 'desc'
  };

  validatedLibrary.selectedSpell = validatedLibrary.selectedSpell || null;

  return validatedLibrary;
}

/**
 * Migrate a library from an older version to the current version
 */
function migrateLibraryVersion(libraryData) {
  const oldVersion = libraryData.version || 0;
  let migratedData = { ...libraryData };

  // Apply version-specific migrations
  switch (oldVersion) {
    case 0:
      // Migration from version 0 to 1
      migratedData = migrateV0ToV1(migratedData);
      break;

    // Add more cases for future migrations
  }

  migratedData.version = LIBRARY_VERSION;

  return migratedData;
}

/**
 * Migrate from version 0 to version 1
 */
function migrateV0ToV1(libraryData) {
  // Example migration logic
  const migratedData = { ...libraryData };

  // In this example, we're adding categoryIds to all spells if they don't have them
  if (migratedData.data && migratedData.data.spells) {
    migratedData.data.spells = migratedData.data.spells.map(spell => {
      if (!spell.categoryIds) {
        spell.categoryIds = ['uncategorized'];
      }
      return spell;
    });
  }

  return migratedData;
}

/**
 * Get statistics about categories
 */
export function getCategoryStats(library) {
  const stats = {};

  // Initialize stats for all categories
  library.categories.forEach(category => {
    stats[category.id] = {
      id: category.id,
      name: category.name,
      color: category.color,
      count: 0
    };
  });

  // Count spells in each category
  library.spells.forEach(spell => {
    const categories = spell.categoryIds || ['uncategorized'];

    categories.forEach(catId => {
      if (stats[catId]) {
        stats[catId].count++;
      }
    });
  });

  return Object.values(stats);
}

/**
 * Get the default library structure
 */
export function getDefaultLibrary() {
  // No longer auto-loading spells - users create their own
  // Create an empty default library
  return {
    spells: [], // Empty - users will populate with their own spells
    categories: createDefaultCategories(),
    filters: {
      query: '',
      categories: [],
      levels: [],
      effectTypes: [],
      spellTypes: [],
      damageTypes: []
    },
    sortOrder: {
      field: 'lastModified',
      direction: 'desc'
    },
    selectedSpell: null
  };
}

/**
 * Create default categories
 * Includes essential categories + general spell categories
 */
export function createDefaultCategories() {
  return [
    {
      id: 'uncategorized',
      name: 'Uncategorized',
      color: '#808080',
      icon: 'inv_misc_book_09',
      description: 'Spells that have not been categorized yet'
    },
    {
      id: 'favorites',
      name: 'Favorites',
      color: '#FFD700',
      icon: 'spell_holy_magicalsentry',
      description: 'Your favorite and most used spells'
    },
    {
      id: 'offensive',
      name: 'Offensive',
      color: '#FF4500',
      icon: 'spell_fire_flamebolt',
      description: 'Damage-dealing spells for combat situations'
    },
    {
      id: 'defensive',
      name: 'Defensive',
      color: '#1E90FF',
      icon: 'spell_holy_powerwordshield',
      description: 'Protective spells for survival and damage mitigation'
    },
    {
      id: 'utility',
      name: 'Utility',
      color: '#32CD32',
      icon: 'spell_nature_polymorph',
      description: 'Utility spells for various non-combat situations'
    },
    {
      id: 'healing',
      name: 'Healing',
      color: '#00FF7F',
      icon: 'spell_holy_flashheal',
      description: 'Healing and restoration spells'
    },
    // General spell categories
    {
      id: 'general_actions',
      name: 'General Actions',
      color: '#8B4513',
      icon: 'ability_warrior_battleshout',
      description: 'Basic actions available to all characters'
    },
    {
      id: 'general_reactions',
      name: 'General Reactions',
      color: '#CD853F',
      icon: 'ability_rogue_evasion',
      description: 'Reactive abilities available to all characters'
    },
    {
      id: 'general_skills',
      name: 'Skill Actions',
      color: '#DEB887',
      icon: 'spell_holy_blessingofstrength',
      description: 'Actions based on character skills'
    },
    {
      id: 'general_enhancements',
      name: 'Enhancements',
      color: '#F4A460',
      icon: 'spell_holy_innerfire',
      description: 'Enhancement abilities for character improvement'
    }
  ];
}

/**
 * Migrate old spell formats to the current format
 */
export function migrateSpellVersion(oldSpell) {
  // Create a copy of the spell
  const migratedSpell = { ...oldSpell };

  // Ensure the spell has the current structure
  // This is different from validateLibraryIntegrity as it focuses on content migration
  // rather than structural validation

  // Example: Migrate damageConfig if it exists but has old structure
  if (migratedSpell.damageConfig && !migratedSpell.damageConfig.damageTypes && migratedSpell.damageConfig.damageType) {
    migratedSpell.damageConfig.damageTypes = [migratedSpell.damageConfig.damageType];
    delete migratedSpell.damageConfig.damageType;
  }

  // Future migrations can be added here

  return migratedSpell;
}

/**
 * Get a spell by ID from the library
 */
export function getSpellById(library, id) {
  return library.spells.find(spell => spell.id === id) || null;
}

/**
 * Check if a spell exists in the library
 */
export function spellExists(library, name) {
  return library.spells.some(spell =>
    spell.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Generate a unique spell name if name already exists
 */
export function generateUniqueName(library, baseName) {
  let name = baseName;
  let counter = 1;

  while (spellExists(library, name)) {
    name = `${baseName} (${counter})`;
    counter++;
  }

  return name;
}