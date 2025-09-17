/**
 * Weapon Integration System
 * 
 * Handles dynamic loading of weapon data into spells, particularly the Attack spell.
 * Integrates with the character store to get equipped weapons and formats them
 * properly for the spell system.
 */

import useCharacterStore from '../store/characterStore';

/**
 * Get the currently equipped weapon for attack calculations
 * @param {string} weaponSlot - 'mainHand', 'offHand', or 'ranged'
 * @returns {Object|null} Weapon data or null if no weapon equipped
 */
export const getEquippedWeapon = (weaponSlot = 'mainHand') => {
  const characterStore = useCharacterStore.getState();
  const equipment = characterStore.equipment;
  
  if (!equipment || !equipment[weaponSlot]) {
    return null;
  }
  
  return equipment[weaponSlot];
};

/**
 * Get weapon damage dice notation from weapon data
 * @param {Object} weapon - Weapon item data
 * @returns {string} Dice notation like "1d8" or "2d6"
 */
export const getWeaponDamageNotation = (weapon) => {
  if (!weapon || !weapon.weaponStats || !weapon.weaponStats.baseDamage) {
    return '1d4'; // Default unarmed damage
  }
  
  const { diceCount, diceType } = weapon.weaponStats.baseDamage;
  return `${diceCount || 1}d${diceType || 4}`;
};

/**
 * Get weapon damage type (slashing, piercing, bludgeoning)
 * @param {Object} weapon - Weapon item data
 * @returns {string} Damage type
 */
export const getWeaponDamageType = (weapon) => {
  if (!weapon || !weapon.weaponStats || !weapon.weaponStats.baseDamage) {
    return 'bludgeoning'; // Default unarmed damage type
  }
  
  return weapon.weaponStats.baseDamage.damageType || 'bludgeoning';
};

/**
 * Get weapon range based on weapon type
 * @param {Object} weapon - Weapon item data
 * @returns {number} Range in feet
 */
export const getWeaponRange = (weapon) => {
  if (!weapon) {
    return 5; // Unarmed reach
  }
  
  // Check if it's a ranged weapon
  if (weapon.slots && weapon.slots.includes('ranged')) {
    // Different ranges for different ranged weapons
    switch (weapon.subtype) {
      case 'BOW':
        return 150;
      case 'CROSSBOW':
        return 120;
      case 'THROWN':
        return 30;
      case 'WAND':
        return 60;
      default:
        return 80;
    }
  }
  
  // Melee weapons
  switch (weapon.subtype) {
    case 'POLEARM':
    case 'SPEAR':
      return 10; // Reach weapons
    default:
      return 5; // Standard melee reach
  }
};

/**
 * Get the appropriate attack attribute for a weapon
 * @param {Object} weapon - Weapon item data
 * @returns {string} Attribute name ('strength' or 'agility')
 */
export const getWeaponAttackAttribute = (weapon) => {
  if (!weapon) {
    return 'strength'; // Unarmed uses strength
  }
  
  // Ranged weapons typically use agility
  if (weapon.slots && weapon.slots.includes('ranged')) {
    return 'agility';
  }
  
  // Finesse weapons (daggers, rapiers) can use agility
  if (weapon.subtype === 'DAGGER' || weapon.subtype === 'RAPIER') {
    return 'agility';
  }
  
  // Most melee weapons use strength
  return 'strength';
};

/**
 * Check if weapon has special properties
 * @param {Object} weapon - Weapon item data
 * @returns {Object} Object containing weapon properties
 */
export const getWeaponProperties = (weapon) => {
  const properties = {
    finesse: false,
    reach: false,
    twoHanded: false,
    versatile: false,
    ranged: false,
    thrown: false
  };
  
  if (!weapon) {
    return properties;
  }
  
  // Check weapon slot type
  if (weapon.weaponSlot === 'TWO_HANDED') {
    properties.twoHanded = true;
  }
  
  // Check if ranged
  if (weapon.slots && weapon.slots.includes('ranged')) {
    properties.ranged = true;
  }
  
  // Check subtype for special properties
  switch (weapon.subtype) {
    case 'DAGGER':
    case 'RAPIER':
      properties.finesse = true;
      break;
    case 'POLEARM':
    case 'SPEAR':
      properties.reach = true;
      break;
    case 'THROWN':
      properties.thrown = true;
      properties.ranged = true;
      break;
  }
  
  return properties;
};

/**
 * Create a dynamic Attack spell based on equipped weapon
 * @param {string} weaponSlot - Which weapon slot to use ('mainHand', 'offHand', 'ranged')
 * @returns {Object} Spell data with weapon-specific properties
 */
export const createWeaponAttackSpell = (weaponSlot = 'mainHand') => {
  const weapon = getEquippedWeapon(weaponSlot);
  const damageNotation = getWeaponDamageNotation(weapon);
  const damageType = getWeaponDamageType(weapon);
  const range = getWeaponRange(weapon);
  const attackAttribute = getWeaponAttackAttribute(weapon);
  const properties = getWeaponProperties(weapon);
  
  // Base attack spell template
  const attackSpell = {
    id: `attack-${weaponSlot}-dynamic`,
    name: weapon ? `Attack (${weapon.name})` : 'Attack (Unarmed)',
    description: weapon 
      ? `Attack with your ${weapon.name}. ${weapon.description || ''}`
      : 'Attack with your fists or improvised weapons.',
    icon: weapon ? `https://wow.zamimg.com/images/wow/icons/large/${weapon.iconId}.jpg` : 'ability_warrior_savageblow',
    
    spellType: 'ACTION',
    source: 'general',
    tags: ['general', 'attack', 'weapon', damageType],
    effectTypes: ['damage'],
    damageTypes: [damageType],
    
    damageConfig: {
      damageType: 'weapon',
      elementType: 'physical',
      formula: damageNotation,
      weaponDependent: true,
      usesWeaponDice: true,
      addAttributeModifier: true,
      attributeModifier: attackAttribute
    },
    
    targetingConfig: {
      targetingType: 'single',
      range: range,
      validTargets: ['enemy'],
      requiresLineOfSight: !properties.thrown // Thrown weapons can arc over obstacles
    },
    
    resourceCost: {
      mana: 0,
      health: 0,
      stamina: 0,
      focus: 0,
      actionPoints: 2
    },
    
    mechanicsConfig: {
      attackRoll: {
        enabled: true,
        attribute: attackAttribute,
        proficiencyBonus: true,
        weaponProficiency: true
      },
      criticalHit: {
        enabled: true,
        critRange: 20,
        critMultiplier: 2
      },
      weaponProperties: properties
    },
    
    // Dynamic weapon data for reference
    weaponData: weapon ? {
      name: weapon.name,
      type: weapon.subtype,
      damage: damageNotation,
      damageType: damageType,
      range: range,
      properties: Object.keys(properties).filter(key => properties[key])
    } : {
      name: 'Unarmed',
      type: 'UNARMED',
      damage: '1d4',
      damageType: 'bludgeoning',
      range: 5,
      properties: []
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['general_actions']
  };
  
  return attackSpell;
};

/**
 * Get all available attack options based on equipped weapons
 * @returns {Array} Array of attack spell variants
 */
export const getAllWeaponAttackSpells = () => {
  const characterStore = useCharacterStore.getState();
  const equipment = characterStore.equipment;
  const attacks = [];
  
  // Main hand attack
  if (equipment.mainHand) {
    attacks.push(createWeaponAttackSpell('mainHand'));
  }
  
  // Off hand attack (if weapon equipped and not two-handed main weapon)
  if (equipment.offHand && (!equipment.mainHand || equipment.mainHand.weaponSlot !== 'TWO_HANDED')) {
    attacks.push(createWeaponAttackSpell('offHand'));
  }
  
  // Ranged attack
  if (equipment.ranged) {
    attacks.push(createWeaponAttackSpell('ranged'));
  }
  
  // Always include unarmed as fallback
  if (attacks.length === 0) {
    attacks.push(createWeaponAttackSpell('mainHand')); // Will create unarmed attack
  }
  
  return attacks;
};

/**
 * Update a general spell with weapon-specific data
 * @param {Object} spell - The spell to update
 * @param {string} weaponSlot - Which weapon slot to use
 * @returns {Object} Updated spell with weapon data
 */
export const enhanceSpellWithWeaponData = (spell, weaponSlot = 'mainHand') => {
  if (!spell || spell.name !== 'Attack') {
    return spell; // Only enhance Attack spells
  }
  
  const weaponAttack = createWeaponAttackSpell(weaponSlot);
  
  return {
    ...spell,
    ...weaponAttack,
    // Preserve original spell ID and structure
    id: spell.id,
    source: spell.source
  };
};
