/**
 * Stat Modifier System
 * This file contains stat definitions and utilities for managing character stats
 * and their modifications through effects like buffs, debuffs, and equipment.
 */

// Primary stat definitions
export const PRIMARY_STAT_MODIFIERS = [
  {
    id: 'strength',
    name: 'Strength',
    description: 'Influences physical damage, carrying capacity, and physical checks',
    defaultValue: 10,
    category: 'primary',
    icon: '/assets/icons/abilities/General/Sword.png',
    affects: ['piercingDamage', 'slashingDamage', 'bludgeoningDamage', 'carryingCapacity']
  },
  {
    id: 'agility',
    name: 'Agility',
    description: 'Influences dodge chance, movement speed, and agility checks',
    defaultValue: 10,
    category: 'primary',
    icon: '/assets/icons/abilities/Utility/Rest.png',
    affects: ['evasion', 'initiative', 'critChance']
  },
  {
    id: 'constitution',
    name: 'Constitution',
    description: 'Influences health points, stamina, and resistance to physical effects',
    defaultValue: 10,
    category: 'primary',
    icon: '/assets/icons/abilities/Light Path.png',
    affects: ['maxHealth', 'healthRegen']
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    description: 'Influences spell power, knowledge checks, and magic resistance',
    defaultValue: 10,
    category: 'primary',
    icon: '/assets/icons/abilities/Light Path.png',
    affects: ['spellPower', 'manaRegen', 'spellCritChance']
  },
  {
    id: 'spirit',
    name: 'Spirit',
    description: 'Influences mana pool, healing power, and willpower checks',
    defaultValue: 10,
    category: 'primary',
    icon: '/assets/icons/abilities/Light Path.png',
    affects: ['maxMana', 'healingPower']
  },
  {
    id: 'charisma',
    name: 'Charisma',
    description: 'Influences social interactions, persuasion, and some spell effects',
    defaultValue: 10,
    category: 'primary',
    icon: '/assets/icons/abilities/Light Path.png',
    affects: ['persuasion', 'intimidation', 'leadership']
  }
];

// Secondary stat definitions
export const SECONDARY_STAT_MODIFIERS = [
  {
    id: 'hp_regen',
    name: 'Health Regeneration',
    description: 'Amount of health regenerated per round',
    defaultValue: 0,
    category: 'secondary',
    icon: '/assets/icons/abilities/Nature/Natural.png',
    regenerates: true,
    derivedFrom: ['constitution']
  },
  {
    id: 'mp_regen',
    name: 'Mana Regeneration',
    description: 'Amount of mana regenerated per round',
    defaultValue: 0,
    category: 'secondary',
    icon: '/assets/icons/abilities/Arcane/Conjure Elements.png',
    regenerates: true,
    derivedFrom: ['spirit', 'intelligence']
  },
  {
    id: 'healing_power',
    name: 'Healing Power',
    description: 'Increases the effectiveness of healing spells',
    defaultValue: 0,
    category: 'secondary',
    icon: '/assets/icons/abilities/Healing/Golden Heart.png',
    derivedFrom: ['spirit']
  },

];

// Combat-focused stat definitions
export const COMBAT_STAT_MODIFIERS = [
  {
    id: 'initiative',
    name: 'Initiative',
    description: 'Determines action order in combat',
    defaultValue: 0,
    category: 'combat',
    icon: '/assets/icons/abilities/Utility/Rest.png',
    derivedFrom: ['agility', 'intelligence']
  },
  {
    id: 'lifesteal',
    name: 'Lifesteal',
    description: 'Percentage of damage dealt converted to healing',
    defaultValue: 0,
    category: 'combat',
    icon: '/assets/icons/abilities/Necrotic/Drain Life.png',
    derivedFrom: ['spirit']
  },
  {
    id: 'damage_reflection',
    name: 'Damage Reflection',
    description: 'Percentage of damage taken reflected back to attacker',
    defaultValue: 0,
    category: 'combat',
    icon: '/assets/icons/abilities/Fire/Fire Orb.png',
    derivedFrom: ['intelligence', 'spirit']
  }
];

// Element damage types (Spell Power)
export const DAMAGE_TYPE_MODIFIERS = [
  {
    id: 'fire_spell_power',
    name: 'Fire Spell Power',
    description: 'Increases damage of fire spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Fire/Fire Orb.png',
    derivedFrom: ['intelligence']
  },
  {
    id: 'frost_spell_power',
    name: 'Frost Spell Power',
    description: 'Increases damage of frost spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Frost/Frost Touch.png',
    derivedFrom: ['intelligence']
  },
  {
    id: 'lightning_spell_power',
    name: 'Lightning Spell Power',
    description: 'Increases damage of lightning spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Lightning/Lightning Bolt.png',
    derivedFrom: ['intelligence']
  },
  {
    id: 'arcane_spell_power',
    name: 'Arcane Spell Power',
    description: 'Increases damage of arcane spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Arcane/Conjure Elements.png',
    derivedFrom: ['intelligence']
  },
  {
    id: 'nature_spell_power',
    name: 'Nature Spell Power',
    description: 'Increases damage of nature spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Nature/Natural.png',
    derivedFrom: ['intelligence']
  },
  {
    id: 'force_spell_power',
    name: 'Force Spell Power',
    description: 'Increases damage of force spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Arcane/Conjure Elements.png',
    derivedFrom: ['intelligence']
  },
  {
    id: 'necrotic_spell_power',
    name: 'Necrotic Spell Power',
    description: 'Increases damage of necrotic spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Shadow.png',
    derivedFrom: ['intelligence', 'spirit']
  },
  {
    id: 'radiant_spell_power',
    name: 'Radiant Spell Power',
    description: 'Increases damage of radiant spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Light Path.png',
    derivedFrom: ['intelligence', 'spirit']
  },
  {
    id: 'poison_spell_power',
    name: 'Poison Spell Power',
    description: 'Increases damage of poison spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Utility/Rest.png',
    derivedFrom: ['intelligence']
  },
  {
    id: 'psychic_spell_power',
    name: 'Psychic Spell Power',
    description: 'Increases damage of psychic spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Purple Star.png',
    derivedFrom: ['intelligence', 'spirit']
  },
  {
    id: 'chaos_spell_power',
    name: 'Chaos Spell Power',
    description: 'Increases damage of chaos spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Shadow.png',
    derivedFrom: ['intelligence', 'spirit']
  },
  {
    id: 'void_spell_power',
    name: 'Void Spell Power',
    description: 'Increases damage of void spells',
    defaultValue: 0,
    category: 'spell_damage',
    icon: '/assets/icons/abilities/Shadow.png',
    derivedFrom: ['intelligence', 'spirit']
  }
];

// Resistance modifiers
export const RESISTANCE_MODIFIERS = [
  {
    id: 'damage_immunity',
    name: 'Damage Immunity',
    description: 'Grants immunity to all damage types',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Light Path.png',
    derivedFrom: ['constitution', 'spirit']
  },
  {
    id: 'damage_reduction',
    name: 'Damage Reduction',
    description: 'Reduces all incoming damage by a percentage',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Light Path.png',
    derivedFrom: ['constitution']
  },
  {
    id: 'physical_resistance',
    name: 'Physical Resistance',
    description: 'Reduces damage taken from physical attacks',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Light Path.png',
    derivedFrom: ['constitution', 'spirit']
  },
  {
    id: 'damage_reduction',
    name: 'Damage Reduction',
    description: 'Reduces all incoming damage by a percentage',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Light Path.png',
    derivedFrom: ['constitution']
  },
  {
    id: 'fire_resistance',
    name: 'Fire Resistance',
    description: 'Reduces damage taken from fire',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Fire/Fire Orb.png',
    derivedFrom: ['constitution']
  },
  {
    id: 'cold_resistance',
    name: 'Cold Resistance',
    description: 'Reduces damage taken from cold',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Frost/Frost Touch.png',
    derivedFrom: ['constitution']
  },
  {
    id: 'lightning_resistance',
    name: 'Lightning Resistance',
    description: 'Reduces damage taken from lightning',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Lightning/Lightning Bolt.png',
    derivedFrom: ['constitution']
  },
  {
    id: 'acid_resistance',
    name: 'Acid Resistance',
    description: 'Reduces damage taken from acid',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Projectile Acid.png',
    derivedFrom: ['constitution']
  },
  {
    id: 'force_resistance',
    name: 'Force Resistance',
    description: 'Reduces damage taken from force',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Arcane/Conjure Elements.png',
    derivedFrom: ['constitution', 'intelligence']
  },
  {
    id: 'necrotic_resistance',
    name: 'Necrotic Resistance',
    description: 'Reduces damage taken from necrotic magic',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Shadow.png',
    derivedFrom: ['constitution', 'spirit']
  },
  {
    id: 'radiant_resistance',
    name: 'Radiant Resistance',
    description: 'Reduces damage taken from radiant magic',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Light Path.png',
    derivedFrom: ['constitution', 'spirit']
  },
  {
    id: 'poison_resistance',
    name: 'Poison Resistance',
    description: 'Reduces damage taken from poison',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Utility/Rest.png',
    derivedFrom: ['constitution']
  },
  {
    id: 'psychic_resistance',
    name: 'Psychic Resistance',
    description: 'Reduces damage taken from psychic attacks',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Purple Star.png',
    derivedFrom: ['constitution', 'spirit']
  },
  {
    id: 'thunder_resistance',
    name: 'Thunder Resistance',
    description: 'Reduces damage taken from thunder',
    defaultValue: 0,
    category: 'resistance',
    icon: '/assets/icons/abilities/Nature/Natural.png',
    derivedFrom: ['constitution']
  }
];

// Utility stat modifiers
export const UTILITY_STAT_MODIFIERS = [
  {
    id: 'movement_speed',
    name: 'Movement Speed',
    description: 'Base movement speed in feet per round',
    defaultValue: 30,
    category: 'utility',
    icon: '/assets/icons/abilities/Utility/Rest.png',
    derivedFrom: ['agility']
  },
  {
    id: 'swim_speed',
    name: 'Swim Speed',
    description: 'Speed when swimming in feet per round',
    defaultValue: 15,
    category: 'utility',
    icon: '/assets/icons/abilities/Utility/Rest.png',
    derivedFrom: ['strength', 'constitution']
  },
  {
    id: 'vision_range',
    name: 'Vision Range',
    description: 'Distance at which you can see clearly',
    defaultValue: 60,
    category: 'utility',
    icon: '/assets/icons/abilities/Light Path.png',
    derivedFrom: ['intelligence', 'spirit']
  },
  {
    id: 'carrying_capacity',
    name: 'Carrying Capacity',
    description: 'Maximum weight you can carry',
    defaultValue: 10,
    category: 'utility',
    icon: '/assets/icons/abilities/General/Sword.png',
    derivedFrom: ['strength']
  },
  {
    id: 'mana_cost_reduction',
    name: 'Mana Cost Reduction',
    description: 'Reduces the mana cost of spells by a percentage',
    defaultValue: 0,
    category: 'utility',
    icon: '/assets/icons/abilities/Arcane/Conjure Elements.png',
    derivedFrom: ['intelligence', 'spirit']
  },
  {
    id: 'inventory_capacity',
    name: 'Inventory Capacity',
    description: 'Additional inventory slots available',
    defaultValue: 0,
    category: 'utility',
    icon: '/assets/icons/abilities/General/Sword.png',
    derivedFrom: ['strength']
  }
];

// Weapon type damage modifiers
export const WEAPON_DAMAGE_MODIFIERS = [
  {
    id: 'piercing_damage',
    name: 'Piercing Damage',
    description: 'Damage bonus with piercing weapons',
    defaultValue: 0,
    category: 'weapon_damage',
    icon: '/assets/icons/abilities/General/Sword.png',
    derivedFrom: ['strength']
  },
  {
    id: 'slashing_damage',
    name: 'Slashing Damage',
    description: 'Damage bonus with slashing weapons',
    defaultValue: 0,
    category: 'weapon_damage',
    icon: '/assets/icons/abilities/General/Sword.png',
    derivedFrom: ['strength']
  },
  {
    id: 'bludgeoning_damage',
    name: 'Bludgeoning Damage',
    description: 'Damage bonus with bludgeoning weapons',
    defaultValue: 0,
    category: 'weapon_damage',
    icon: '/assets/icons/abilities/Bludgeoning/Mace.png',
    derivedFrom: ['strength']
  }
];

// Stat modifiers specifically for buffs and debuffs (excludes unwanted stats)
export const BUFF_DEBUFF_STAT_MODIFIERS = [
  // Primary stats - always useful for buffs/debuffs
  ...PRIMARY_STAT_MODIFIERS,

  // Secondary stats - useful for buffs/debuffs
  ...SECONDARY_STAT_MODIFIERS,

  // Combat stats - only the useful ones (no hit/crit chance)
  ...COMBAT_STAT_MODIFIERS.filter(stat =>
    !stat.id.includes('hit_chance') &&
    !stat.id.includes('crit_chance') &&
    !stat.id.includes('crit_damage')
  ),

  // All damage type modifiers - useful for buffs/debuffs
  ...DAMAGE_TYPE_MODIFIERS,

  // All resistance modifiers - useful for buffs/debuffs
  ...RESISTANCE_MODIFIERS,

  // Utility stats - useful for buffs/debuffs
  ...UTILITY_STAT_MODIFIERS,

  // Weapon damage modifiers - useful for buffs/debuffs
  ...WEAPON_DAMAGE_MODIFIERS
];

// Combined array of all stat modifiers
export const ALL_STAT_MODIFIERS = [
  ...PRIMARY_STAT_MODIFIERS,
  ...SECONDARY_STAT_MODIFIERS,
  ...COMBAT_STAT_MODIFIERS,
  ...DAMAGE_TYPE_MODIFIERS,
  ...RESISTANCE_MODIFIERS,
  ...UTILITY_STAT_MODIFIERS,
  ...WEAPON_DAMAGE_MODIFIERS
];

/**
 * Find a stat by its ID
 */
export function findStatById(statId) {
  if (!statId) return null;

  // Convert to lowercase for case-insensitive matching
  const normalizedId = statId.toLowerCase().replace(/-/g, '_');

  // First check exact match
  const directMatch = ALL_STAT_MODIFIERS.find(stat =>
    stat.id.toLowerCase() === normalizedId
  );

  if (directMatch) return directMatch;

  // Then try partial matching for more flexible lookup
  return ALL_STAT_MODIFIERS.find(stat =>
    stat.id.toLowerCase().includes(normalizedId) ||
    normalizedId.includes(stat.id.toLowerCase())
  );
}

/**
 * Find stats by category
 */
export function findStatsByCategory(category) {
  if (!category) return [];
  return ALL_STAT_MODIFIERS.filter(stat => stat.category === category);
}

/**
 * Get stats affected by a specific effect type
 */
export function getStatsAffectedByEffect(effectType) {
  switch (effectType.toLowerCase()) {
    case 'buff':
      // Most stats can be buffed, but filter out some that don't make sense
      return ALL_STAT_MODIFIERS.filter(stat =>
        !stat.id.includes('negative') &&
        !stat.id.includes('immunity')
      );
    case 'debuff':
      // Most stats can be debuffed, but filter out some that don't make sense
      return ALL_STAT_MODIFIERS.filter(stat =>
        !stat.id.includes('immunity') &&
        !stat.id.includes('resistance')
      );
    case 'direct_damage':
      // Stats related to direct damage (offensive stats)
      return [...DAMAGE_TYPE_MODIFIERS, ...WEAPON_DAMAGE_MODIFIERS, ...COMBAT_STAT_MODIFIERS.filter(stat =>
        stat.id.includes('damage') ||
        stat.id.includes('crit') ||
        stat.id.includes('hit')
      )];
    case 'healing':
      // Stats related to healing
      return SECONDARY_STAT_MODIFIERS.filter(stat =>
        stat.id.includes('healing') ||
        stat.id.includes('regen') ||
        stat.regenerates
      );
    case 'utility':
      // Utility stats
      return [...UTILITY_STAT_MODIFIERS];
    default:
      return [];
  }
}

/**
 * Apply a flat modifier to a stat value
 */
export function applyFlatStatModifier(baseValue, modifier) {
  return baseValue + modifier;
}

/**
 * Apply a percentage modifier to a stat value
 */
export function applyPercentageStatModifier(baseValue, percentage) {
  return baseValue * (1 + percentage / 100);
}

/**
 * Calculate D&D-style attribute modifier
 */
export function calculateAttributeModifier(attributeValue) {
  return Math.floor((attributeValue - 10) / 2);
}

/**
 * Get a descriptive text for a stat modification
 */
export function getStatModifierDescription(statId, value, type = 'flat') {
  const stat = findStatById(statId);
  const statName = stat ? stat.name : statId;

  // Handle special cases
  if (statId.includes('resistance')) {
    const element = statId.split('_')[0];
    return `${value}% ${element.charAt(0).toUpperCase() + element.slice(1)} Resistance`;
  }

  if (statId.includes('vuln')) {
    const element = statId.split('_')[0];
    return `${value}% increased ${element} damage taken`;
  }

  if (type === 'percentage') {
    return `${value > 0 ? '+' : ''}${value}% ${statName}`;
  }

  return `${value > 0 ? '+' : ''}${value} ${statName}`;
}

/**
 * Calculate combined effect of multiple stat modifiers
 */
export function calculateCombinedModifiers(modifiers, baseStats) {
  const result = { ...baseStats };

  // First apply flat modifiers
  modifiers.filter(mod => mod.type === 'flat' || !mod.type).forEach(mod => {
    if (result[mod.stat] !== undefined) {
      result[mod.stat] = applyFlatStatModifier(result[mod.stat], mod.value);
    }
  });

  // Then apply percentage modifiers
  modifiers.filter(mod => mod.type === 'percentage').forEach(mod => {
    if (result[mod.stat] !== undefined) {
      result[mod.stat] = applyPercentageStatModifier(result[mod.stat], mod.value);
    }
  });

  return result;
}

/**
 * Get base stats for a character level
 */
export function getBaseStatsForLevel(level) {
  const baseStats = {};

  // Set default values for primary stats based on level
  PRIMARY_STAT_MODIFIERS.forEach(stat => {
    baseStats[stat.id] = stat.defaultValue + Math.floor(level / 4);
  });

  // Set default values for secondary stats
  SECONDARY_STAT_MODIFIERS.forEach(stat => {
    baseStats[stat.id] = stat.defaultValue;
  });

  // Derive secondary stats from primary stats
  SECONDARY_STAT_MODIFIERS.forEach(stat => {
    if (stat.derivedFrom) {
      let derivedValue = 0;
      stat.derivedFrom.forEach(primaryStat => {
        if (baseStats[primaryStat]) {
          // Add a portion of the primary stat to the secondary stat
          derivedValue += calculateAttributeModifier(baseStats[primaryStat]);
        }
      });

      // Add the derived value to the base value
      baseStats[stat.id] += derivedValue;
    }
  });

  return baseStats;
}

// Export a default object for easier importing
export default {
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  BUFF_DEBUFF_STAT_MODIFIERS,
  findStatById,
  findStatsByCategory,
  getStatsAffectedByEffect,
  applyFlatStatModifier,
  applyPercentageStatModifier,
  calculateAttributeModifier,
  getStatModifierDescription
};