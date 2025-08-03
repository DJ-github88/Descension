// Class resource utilities for character management

// Define class-specific resource types
export const CLASS_RESOURCES = {
  BARBARIAN: { name: 'Rage', color: '#dc2626', max: 3 },
  BARD: { name: 'Inspiration', color: '#7c3aed', max: 3 },
  CLERIC: { name: 'Channel Divinity', color: '#fbbf24', max: 2 },
  DRUID: { name: 'Wild Shape', color: '#16a34a', max: 2 },
  FIGHTER: { name: 'Action Surge', color: '#dc2626', max: 1 },
  MONK: { name: 'Ki Points', color: '#0ea5e9', max: 4 },
  PALADIN: { name: 'Lay on Hands', color: '#fbbf24', max: 5 },
  RANGER: { name: 'Hunter\'s Mark', color: '#16a34a', max: 3 },
  ROGUE: { name: 'Sneak Attack', color: '#6b7280', max: 1 },
  SORCERER: { name: 'Sorcery Points', color: '#dc2626', max: 4 },
  WARLOCK: { name: 'Spell Slots', color: '#7c3aed', max: 2 },
  WIZARD: { name: 'Arcane Recovery', color: '#0ea5e9', max: 1 },
  ARTIFICER: { name: 'Infusions', color: '#f59e0b', max: 2 },
  BLOOD_HUNTER: { name: 'Blood Curses', color: '#dc2626', max: 2 },
  MYSTIC: { name: 'Psi Points', color: '#7c3aed', max: 6 },
  // Additional classes
  DEATH_KNIGHT: { name: 'Death Coil', color: '#1f2937', max: 3 },
  DEMON_HUNTER: { name: 'Fury', color: '#7c2d12', max: 4 },
  EVOKER: { name: 'Essence', color: '#0ea5e9', max: 5 },
  SHAMAN: { name: 'Totems', color: '#16a34a', max: 3 },
  HUNTER: { name: 'Focus', color: '#16a34a', max: 100 },
  MAGE: { name: 'Arcane Orbs', color: '#0ea5e9', max: 4 },
  PRIEST: { name: 'Holy Power', color: '#fbbf24', max: 3 },
  WARRIOR: { name: 'Rage', color: '#dc2626', max: 100 },
  WARLOCK_ALT: { name: 'Soul Shards', color: '#7c3aed', max: 5 },
  ROGUE_ALT: { name: 'Combo Points', color: '#fbbf24', max: 5 },
  DRUID_ALT: { name: 'Astral Power', color: '#7c3aed', max: 100 },
  MONK_ALT: { name: 'Chi', color: '#0ea5e9', max: 6 }
};

// Get resource configuration for a character class
export function getClassResource(characterClass) {
  if (!characterClass) return null;
  
  const upperClass = characterClass.toUpperCase().replace(/\s+/g, '_');
  return CLASS_RESOURCES[upperClass] || null;
}

// Calculate resource maximum based on level (if applicable)
export function calculateResourceMax(characterClass, level = 1) {
  const resource = getClassResource(characterClass);
  if (!resource) return 0;
  
  // Some classes scale with level
  switch (characterClass.toUpperCase()) {
    case 'MONK':
      return Math.min(level, 20); // Ki points equal to level
    case 'SORCERER':
      return Math.min(level, 20); // Sorcery points equal to level
    case 'BARBARIAN':
      return Math.min(2 + Math.floor(level / 3), 6); // Rage uses scale with level
    default:
      return resource.max;
  }
}

// Get resource color for UI display
export function getResourceColor(characterClass) {
  const resource = getClassResource(characterClass);
  return resource ? resource.color : '#6b7280';
}

// Get resource name for display
export function getResourceName(characterClass) {
  const resource = getClassResource(characterClass);
  return resource ? resource.name : 'Resource';
}

// Check if class has a special resource
export function hasClassResource(characterClass) {
  return getClassResource(characterClass) !== null;
}

export default {
  CLASS_RESOURCES,
  getClassResource,
  calculateResourceMax,
  getResourceColor,
  getResourceName,
  hasClassResource
};
