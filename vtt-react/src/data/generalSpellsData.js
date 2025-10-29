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
  // Attack - Dynamic weapon-based attack (will be enhanced by useWeaponEnhancedSpells)
  {
    ...createGeneralSpell(
      'Attack',
      'Attack with your equipped weapon or unarmed strike. Damage and properties depend on your currently equipped weapon.',
      'ACTION',
      2,
      'ability_warrior_savageblow'
    ),
    effectTypes: ['damage'],
    damageTypes: ['weapon_dependent'],
    damageConfig: {
      damageType: 'weapon',
      elementType: 'physical',
      formula: 'WEAPON_DAMAGE',
      weaponDependent: true,
      usesWeaponDice: true,
      addAttributeModifier: true,
      attributeModifier: 'strength'
    },
    targetingConfig: {
      targetingType: 'single',
      range: 'WEAPON_RANGE',
      validTargets: ['enemy'],
      requiresLineOfSight: true
    },
    mechanicsConfig: {
      attackRoll: {
        enabled: true,
        attribute: 'strength',
        proficiencyBonus: true,
        weaponProficiency: true
      },
      criticalHit: {
        enabled: true,
        critRange: 20,
        critMultiplier: 2
      }
    }
  }
];

// Combine all general actions
export const ALL_GENERAL_SPELLS = [
  ...GENERAL_SPELLS
];

// Export the general spells category
export const GENERAL_SPELLS_CATEGORY = {
  id: 'general_actions',
  name: 'General',
  description: 'Universal baseline spells and actions available to all classes',
  icon: 'inv_misc_book_07',
  color: '#8B4513',
  spells: ALL_GENERAL_SPELLS.map(spell => spell.id)
};

// Export categories for organization
export const GENERAL_CATEGORIES = [
  GENERAL_SPELLS_CATEGORY
];
