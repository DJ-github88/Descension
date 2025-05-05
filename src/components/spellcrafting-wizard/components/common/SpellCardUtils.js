/**
 * SpellCardUtils.js
 * 
 * Utility functions for spell cards that don't depend on any other modules
 * to avoid circular dependencies.
 */

// Format damage or healing values
export const formatDamageOrHealing = (data) => {
  // Special handling for card-based spells
  if (data?.resolution === 'CARDS' && data?.cardConfig) {
    return data.cardConfig.formula || `Draw ${data.cardConfig.drawCount || 3} cards`;
  }

  // Special handling for coin-based spells
  if (data?.resolution === 'COINS' && data?.coinConfig) {
    return data.coinConfig.formula || `Flip ${data.coinConfig.flipCount || 5} coins`;
  }

  // Handle different data formats
  if (!data) {
    return 'Variable';
  }

  if (data.dice && data.dice !== 'N/A') {
    return `${data.dice}${data.flat > 0 ? ` + ${data.flat}` : ''}`;
  } else if (data.flat || data.flat === 0) {
    return `${data.flat}`;
  } else if (typeof data === 'string') {
    return data;
  } else if (data.formula) {
    return data.formula;
  }

  return 'Variable';
};

// Get color for damage type
export const getDamageTypeColor = (type) => {
  const typeColors = {
    fire: '#ef4444',
    frost: '#38bdf8',
    arcane: '#a855f7',
    nature: '#22c55e',
    shadow: '#6b21a8',
    holy: '#f59e0b',
    lightning: '#facc15',
    physical: '#9ca3af',
    acid: '#84cc16',
    poison: '#10b981',
    psychic: '#8b5cf6',
    radiant: '#fbbf24',
    necrotic: '#7e22ce',
    thunder: '#3b82f6',
    force: '#ec4899',
    cold: '#0ea5e9',
    bludgeoning: '#94a3b8',
    piercing: '#94a3b8',
    slashing: '#94a3b8'
  };
  return typeColors[type?.toLowerCase()] || '#9ca3af';
};

// Format cooldown text
export const formatCooldown = (cooldownConfig) => {
  if (!cooldownConfig || !cooldownConfig.enabled) return null;
  
  const { cooldownRounds, cooldownType } = cooldownConfig;
  if (cooldownType === 'rounds') {
    return `${cooldownRounds} round${cooldownRounds > 1 ? 's' : ''}`;
  } else if (cooldownType === 'turns') {
    return `${cooldownRounds} turn${cooldownRounds > 1 ? 's' : ''}`;
  } else if (cooldownType === 'longRest') {
    return 'Long Rest';
  } else if (cooldownType === 'shortRest') {
    return 'Short Rest';
  }
  return `${cooldownRounds} ${cooldownType}`;
};

// Get resource cost text
export const getResourceCost = (resourceCost) => {
  if (!resourceCost) return 'No Cost';
  
  const costs = [];
  if (resourceCost.mana > 0) costs.push(`${resourceCost.mana} Mana`);
  if (resourceCost.health > 0) costs.push(`${resourceCost.health} Health`);
  if (resourceCost.stamina > 0) costs.push(`${resourceCost.stamina} Stamina`);
  if (resourceCost.focus > 0) costs.push(`${resourceCost.focus} Focus`);
  
  return costs.length > 0 ? costs.join(', ') : 'No Cost';
};

// Format casting time
export const formatCastTime = (spell) => {
  if (!spell.castTime) {
    if (spell.spellType === 'ACTION') return 'Instant';
    if (spell.spellType === 'REACTION') return 'Reaction';
    if (spell.spellType === 'PASSIVE') return 'Passive';
    if (spell.spellType === 'CHANNELED') return 'Channeled';
    return 'Instant';
  }
  return spell.castTime;
};

// Format range
export const formatRange = (spell) => {
  if (!spell.range) {
    if (spell.targetingConfig?.rangeDistance) {
      return `${spell.targetingConfig.rangeDistance} ft`;
    }
    return '30 ft';
  }
  return spell.range;
};

// Get resolution icon
export const getResolutionIcon = (spell) => {
  if (!spell.resolution) return null;
  
  if (spell.resolution === 'DICE') return '🎲';
  if (spell.resolution === 'CARDS') return '🃏';
  if (spell.resolution === 'COINS') return '🪙';
  return null;
};

// Get resolution text
export const getResolutionText = (spell) => {
  if (!spell.resolution) return '';
  
  if (spell.resolution === 'DICE') return 'Dice';
  if (spell.resolution === 'CARDS') return 'Cards';
  if (spell.resolution === 'COINS') return 'Coins';
  return spell.resolution;
};

// Format duration
export const formatDuration = (spell) => {
  if (!spell.durationType || spell.durationType === 'instant') return 'Instant';
  
  if (spell.durationType === 'concentration') {
    return `Concentration (${spell.duration || 1} ${spell.durationUnit || 'minute'}${spell.duration > 1 ? 's' : ''})`;
  }
  
  if (spell.durationType === 'rounds') {
    return `${spell.duration || 1} round${spell.duration > 1 ? 's' : ''}`;
  }
  
  if (spell.durationType === 'turns') {
    return `${spell.duration || 1} turn${spell.duration > 1 ? 's' : ''}`;
  }
  
  return `${spell.duration || 1} ${spell.durationUnit || 'round'}${spell.duration > 1 ? 's' : ''}`;
};

// Get spell school color
export const getSpellSchoolColor = (school) => {
  if (!school) return '';
  
  const schoolLower = school.toLowerCase();
  if (schoolLower === 'fire') return 'spell-fire';
  if (schoolLower === 'frost' || schoolLower === 'cold') return 'spell-frost';
  if (schoolLower === 'arcane') return 'spell-arcane';
  if (schoolLower === 'nature') return 'spell-nature';
  if (schoolLower === 'shadow') return 'spell-shadow';
  if (schoolLower === 'holy') return 'spell-holy';
  if (schoolLower === 'lightning') return 'spell-lightning';
  return 'spell-physical';
};

// Get rarity class
export const getRarityClass = (rarity) => {
  if (!rarity) return '';
  return rarity.toLowerCase();
};

// Get border color based on school
export const getBorderColor = (spell) => {
  if (!spell.school) return '#3b3b3b';
  
  const schoolLower = spell.school.toLowerCase();
  if (schoolLower === 'fire') return '#ef4444';
  if (schoolLower === 'frost' || schoolLower === 'cold') return '#38bdf8';
  if (schoolLower === 'arcane') return '#a855f7';
  if (schoolLower === 'nature') return '#22c55e';
  if (schoolLower === 'shadow') return '#6b21a8';
  if (schoolLower === 'holy') return '#f59e0b';
  if (schoolLower === 'lightning') return '#facc15';
  return '#3b3b3b';
};
