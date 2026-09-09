/**
 * creatureAbilityUtils - shared creature ability helpers.
 *
 * transformAbilityToSpell converts a creature ability (legacy creature-wizard
 * format or spell-wizard format) into the spell object shape rendered by
 * UnifiedSpellCard. Single source of truth used by both the creature inspect
 * view and the GM hover ability fan-out on grid tokens.
 */

import { normalizeDamageType } from '../components/spellcrafting-wizard/core/data/damageTypes';

/**
 * Icon ids that are really "no icon chosen" placeholders. Abilities carrying
 * one of these get a derived thematic icon instead so fans and cards never
 * show a wall of identical placeholder art.
 */
export const PLACEHOLDER_ABILITY_ICONS = new Set([
  'inv_misc_questionmark',
  'inv_sword_04'
]);

// Damage/element theme -> verified ability icon path (Folder/File, no extension)
const DAMAGE_THEME_ICONS = {
  smashing: 'Bludgeoning/Beast Punch',
  bludgeoning: 'Bludgeoning/Beast Punch',
  slashing: 'Slashing/Axe Slash',
  slicing: 'Slashing/Axe Slash',
  piercing: 'Piercing/Backstab',
  stabbing: 'Piercing/Backstab',
  ember: 'Fire/Burning Touch',
  fire: 'Fire/Burning Touch',
  heat: 'Fire/Burning Ember',
  rime: 'Frost/Blow Frost',
  frost: 'Frost/Blow Frost',
  ice: 'Frost/Blow Frost',
  cold: 'Frost/Cold Bone Step',
  storm: 'Lightning/Electric Strike',
  lightning: 'Lightning/Jagged Lightning',
  thunder: 'Lightning/Hail Thunder',
  arcane: 'Arcane/Abstract Rune',
  force: 'Force/Diagonal Energy Beam',
  primal: 'Nature/Beast Mark',
  nature: 'Nature/Boar Head',
  blight: 'Necrotic/Blood Skull',
  necrotic: 'Necrotic/Blood Skull',
  shadow: 'Necrotic/Arise',
  poison: 'Poison/Acid Splash',
  acid: 'Poison/Acid Drip',
  wyrd: 'Chaos/Chaotic Rupture',
  chaos: 'Chaos/Chaotic Shuffle',
  sacred: 'Radiant/Angelic Sword',
  radiant: 'Radiant/Bright Explosion',
  holy: 'Radiant/Angelic Ascension',
  psychic: 'Psychic/Agonizing Scream',
  mind: 'Psychic/Brain Psionics',
  healing: 'Healing/Golden Heart',
  heal: 'Healing/Cure Within',
  void: 'Void/Black Hole',
  // Aliases used by resistance/vulnerability summaries
  stabbing: 'Piercing/Backstab',
  physical: 'Bludgeoning/Beast Punch',
  melee: 'Slashing/Axe Slash',
  ranged: 'Piercing/Arrow Shot'
};

// Fallback pools per ability type — every entry is a verified icon path.
// Used when an ability has no icon and no damage theme, hashed by name so
// different abilities on the same creature get different icons.
const GENERIC_ICON_POOLS = {
  melee: [
    'Slashing/Axe Slash',
    'Bludgeoning/Beast Punch',
    'Piercing/Backstab',
    'General/Break Bone',
    'Slashing/Aura Blade',
    'Bludgeoning/Ceremonial Hammer'
  ],
  ranged: [
    'Piercing/Arrow Shot',
    'Piercing/Arrows',
    'General/Bow',
    'Piercing/Aimed Up',
    'Piercing/Apple Pierced Arrows',
    'Piercing/Arrow Wavy Path'
  ],
  spell: [
    'Arcane/Abstract Rune',
    'Arcane/Angular Rune',
    'Fire/Burning Touch',
    'Frost/Blow Frost',
    'Lightning/Electric Strike',
    'Necrotic/Arise'
  ],
  special: [
    'Utility/All Seeing Eye',
    'Utility/Beast Paw Claws',
    'Utility/Barred Shield',
    'General/Beckoning Shout',
    'General/Bolster',
    'Psychic/Cast Doubt',
    'Chaos/Chaotic Shuffle',
    'Utility/Armored Warrior'
  ]
};

// Cheap deterministic hash so an ability keeps a stable icon across renders
const hashString = (value) => {
  const str = String(value || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

// Last-resort keyword scan over name + description for a theme.
// (Deliberately avoids substrings with common false positives like 'ice'
// in service/justice or 'bow' in elbow/rainbow.)
const THEME_KEYWORDS = [
  ['fire', 'ember'], ['ember', 'ember'], ['burning', 'ember'],
  ['frost', 'rime'], ['rime', 'rime'], ['cold', 'rime'], ['frozen', 'rime'],
  ['lightning', 'storm'], ['storm', 'storm'], ['thunder', 'storm'],
  ['shadow', 'blight'], ['necro', 'blight'], ['blood', 'blight'],
  ['holy', 'sacred'], ['radiant', 'sacred'],
  ['poison', 'poison'], ['venom', 'poison'], ['acid', 'poison'],
  ['psychic', 'psychic'], ['mind', 'psychic'], ['memory', 'psychic'],
  ['heal', 'healing'],
  ['arcane', 'arcane'], ['nature', 'primal'],
  ['chaos', 'wyrd'], ['wyrd', 'wyrd'],
  ['claw', 'slashing'], ['bite', 'piercing'], ['punch', 'smashing'],
  ['arrow', 'piercing'], ['axe', 'slashing'],
  ['hammer', 'smashing'], ['sword', 'slashing']
];

/**
 * Resolve a display icon id for a creature ability.
 * Priority: explicit non-placeholder icon > damage/element theme (or keyword
 * match in name/description) > name-hashed pick from the type pool, so
 * abilities never share one placeholder icon.
 *
 * @param {object} ability - raw creature ability
 * @param {number} salt - extra offset so adjacent abilities spread across the pool
 * @returns {string} icon id in "Folder/Name" form (or the explicit icon id)
 */
export const resolveCreatureAbilityIcon = (ability, salt = 0) => {
  if (!ability) return 'Utility/Ornate Symbol';

  const explicit = ability.typeConfig?.icon || ability.icon || ability.damageConfig?.icon || ability.healingConfig?.icon;
  if (explicit && typeof explicit === 'string' && !PLACEHOLDER_ABILITY_ICONS.has(explicit)) {
    return explicit;
  }

  const rawTheme = ability.damage?.damageType || ability.damageConfig?.elementType || ability.damageType;
  if (rawTheme && typeof rawTheme === 'string') {
    const canonical = (typeof normalizeDamageType === 'function' ? normalizeDamageType(rawTheme) : rawTheme) || rawTheme;
    const themed = DAMAGE_THEME_ICONS[String(canonical).toLowerCase()];
    if (themed) return themed;
  }

  const haystack = `${ability.name || ''} ${ability.title || ''} ${ability.description || ''}`.toLowerCase();
  for (const [keyword, theme] of THEME_KEYWORDS) {
    if (haystack.includes(keyword)) {
      const themed = DAMAGE_THEME_ICONS[theme];
      if (themed) return themed;
    }
  }

  const type = (ability.type || 'special').toLowerCase();
  const pool = GENERIC_ICON_POOLS[type] || GENERIC_ICON_POOLS.special;
  const seed = hashString(ability.name || ability.title || ability.id || 'ability') + salt;
  return pool[seed % pool.length];
};

/**
 * Resolve a small damage-type icon for resistance/immunity/vulnerability
 * chips and similar UI. Always returns a verified icon path.
 */
export const getDamageTypeChipIcon = (type) => {
  const key = String(type || '').toLowerCase();
  const canonical = (typeof normalizeDamageType === 'function' ? normalizeDamageType(key) : key) || key;
  return DAMAGE_THEME_ICONS[canonical] || DAMAGE_THEME_ICONS[key] || 'Utility/All Seeing Eye';
};

export const transformAbilityToSpell = (ability) => {
  // Check if this ability already has the spell wizard format (from BasicAbilityCreator or spell library)
  // If it has damageConfig, healingConfig, buffConfig, etc., it's already in the correct format
  const hasSpellWizardFormat = ability.damageConfig || ability.healingConfig || 
                                ability.buffConfig || ability.debuffConfig || 
                                ability.controlConfig || ability.utilityConfig ||
                                ability.summonConfig || ability.transformationConfig;
  
  if (hasSpellWizardFormat) {
    // Ability is already in spell wizard format - pass it through with minimal transformation
    return {
      id: ability.id || `ability-${ability.name}`,
      name: ability.name,
      description: ability.description || '',
      icon: ability.icon || 'inv_misc_questionmark',
      spellType: ability.spellType || 'ACTION',
      effectTypes: ability.effectTypes || [],
      typeConfig: ability.typeConfig || {},
      damageConfig: ability.damageConfig,
      healingConfig: ability.healingConfig,
      buffConfig: ability.buffConfig,
      debuffConfig: ability.debuffConfig,
      controlConfig: ability.controlConfig,
      utilityConfig: ability.utilityConfig,
      summonConfig: ability.summonConfig,
      transformationConfig: ability.transformationConfig,
      targetingConfig: ability.targetingConfig,
      resourceCost: ability.resourceCost || {
        actionPoints: ability.actionPointCost || ability.apCost || 0
      },
      cooldownConfig: ability.cooldownConfig,
      resolution: ability.resolution || 'DICE',
      tags: ability.tags || [],
      priorityRange: ability.priorityRange // Pass through priority range for badge display
    };
  }

  // Legacy format - transform old ability structure to spell card format
  const ap = ability.actionPointCost || ability.apCost || 0;

  // Build simple resource cost using Action Points (AP)
  const resourceCost = ap > 0 ? { actionPoints: ap } : undefined;

  // Aggregate damage types from primary damage and effects (e.g., piercing + necrotic)
  const damageTypesSet = new Set();
  if (ability.damage?.damageType) damageTypesSet.add(String(ability.damage.damageType).toLowerCase());
  if (ability.damageType) damageTypesSet.add(String(ability.damageType).toLowerCase());
  if (Array.isArray(ability.effects)) {
    ability.effects.forEach(e => {
      const t = (e.damageType || e.type || '').toString().toLowerCase();
      if (e.type === 'DAMAGE' || e.type === 'damage') {
        if (t) damageTypesSet.add(t);
      }
    });
  }
  // Normalize legacy ids (shadow, holy, cold, ...) onto the canonical 12
  const normalize = (t) => normalizeDamageType(t) || t;
  const damageTypes = Array.from(damageTypesSet).map(normalize).filter(Boolean);

  // Best-effort damage mapping so the card can show damage context
  let damageConfig;
  if (ability.damage) {
    if (typeof ability.damage === 'object') {
      const bonus = ability.damage.bonus ? `+${ability.damage.bonus}` : '';
      const formula = `${ability.damage.diceCount || 1}d${ability.damage.diceType || 6}${bonus}`;
      damageConfig = {
        formula,
        damageType: 'direct', // Legacy format uses 'direct' for instant damage
        elementType: normalize((ability.damage.damageType || ability.damageType || 'smashing').toLowerCase()),
        damageTypes: damageTypes.slice(0, 2)
      };
    } else if (typeof ability.damage === 'string') {
      damageConfig = {
        formula: ability.damage,
        damageType: 'direct',
        elementType: normalize((ability.damageType || 'smashing').toLowerCase()),
        damageTypes: damageTypes.slice(0, 2)
      };
    }
  }

  return {
    id: ability.id || `ability-${ability.name}`,
    name: ability.name,
    spellType: ability.spellType || 'ACTION',
    icon: ability.icon || 'inv_sword_04',
    description: ability.description || '',
    castTime: ability.castTime || 'Action',
    range: typeof ability.range === 'number' ? ability.range : (ability.range || undefined),
    duration: ability.duration || undefined,
    resourceCost,
    damageConfig,
    effectTypes: damageConfig ? ['damage'] : undefined,
    // Keep any raw effects for potential future mapping
    effects: ability.effects || [],
    priorityRange: ability.priorityRange // Pass through priority range for badge display
  };
};
