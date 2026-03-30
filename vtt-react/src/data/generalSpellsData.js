/**
 * General Spells Data
 *
 * Universal baseline spells/actions available to all classes
 */

// Helper function to generate spell IDs
const generateSpellId = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-general';
};

// Helper function to create base general spell template
const createGeneralSpell = (name, description, spellType, actionPoints, icon) => ({
  id: generateSpellId(name),
  name,
  description,
  icon,
  spellType,
  source: 'general',
  tags: ['general', 'baseline'],
  effectTypes: [],
  damageTypes: [],
  dateCreated: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  resourceCost: {
    mana: 0,
    health: 0,
    stamina: 0,
    focus: 0,
    actionPoints: actionPoints
  },
  targetingConfig: {
    targetingType: 'single',
    range: 5,
    validTargets: ['enemy'],
    requiresLineOfSight: true
  },
  durationConfig: {
    type: 'instant',
    value: 0,
    unit: 'seconds',
    concentration: false
  },
  resolution: 'DICE',
  categoryIds: ['general_actions']
});

// General spells/actions available to all characters
export const GENERAL_SPELLS = [
  // Note: Attack spell has been removed - use dynamic Attack (Unarmed) from weaponIntegration instead
];

// Combine all general actions
export const ALL_GENERAL_SPELLS = [
  ...GENERAL_SPELLS
];

// Export the general spells category
export const GENERAL_SPELLS_CATEGORY = {
  id: 'general_actions',
  name: 'General Actions',
  description: 'Universal baseline spells and actions available to all classes',
  icon: 'inv_misc_book_07',
  color: '#8B4513',
  spells: ALL_GENERAL_SPELLS.map(spell => spell.id)
};

// Export the general reactions category
export const GENERAL_REACTIONS_CATEGORY = {
  id: 'general_reactions',
  name: 'General Reactions',
  description: 'Reactive abilities available to all characters',
  icon: 'ability_rogue_evasion',
  color: '#CD853F',
  spells: [] // Spells will be populated from universal combat spells
};

// Export categories for organization
export const GENERAL_CATEGORIES = [
  GENERAL_SPELLS_CATEGORY,
  GENERAL_REACTIONS_CATEGORY
];
