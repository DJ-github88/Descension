// Creature Tooltip Utility Functions
// Provides classification and formatting for creature token tooltips

// === HEALTH STATE ===
// Returns qualitative health state based on HP percentage
export const getHealthState = (currentHp, maxHp) => {
  if (maxHp <= 0) return { label: 'Unknown', color: '#8b7d6b', pct: 0, barFill: 0 };
  
  const pct = (currentHp / maxHp) * 100;
  const barFill = Math.max(0, Math.min(100, pct));
  
  if (currentHp <= 0) return { label: 'Defeated', color: '#8b7d6b', pct: 0, barFill: 0 };
  if (pct === 100) return { label: 'Pristine', color: '#506e30', pct, barFill };
  if (pct >= 75) return { label: 'Healthy', color: '#4a6a2e', pct, barFill };
  if (pct >= 50) return { label: 'Wounded', color: '#7a6812', pct, barFill };
  if (pct >= 25) return { label: 'Bloodied', color: '#9a5e15', pct, barFill };
  if (pct >= 10) return { label: 'Critical', color: '#8b3a2a', pct, barFill };
  return { label: "Death's Door", color: '#6b2a1a', pct, barFill };
};

// === SPEED RATING ===
// Returns qualitative speed description
export const getSpeedRating = (speed) => {
  if (speed === 0) return { label: 'Immobile', color: '#8b7d6b', icon: '🚫' };
  if (speed <= 15) return { label: 'Crippled', color: '#8b3a2a', icon: '🩹' };
  if (speed <= 25) return { label: 'Slow', color: '#9a5e15', icon: '🐢' };
  if (speed <= 35) return { label: 'Normal', color: '#5a4a3a', icon: '🚶' };
  if (speed <= 50) return { label: 'Fast', color: '#4a6a8a', icon: '🏃' };
  if (speed <= 70) return { label: 'Swift', color: '#3a5a7a', icon: '💨' };
  return { label: 'Blazing', color: '#2a8a8a', icon: '⚡' };
};

// === ARMOR RATING ===
// Returns qualitative armor description for creatures (resistances only)
export const getArmorRating = (armor) => {
  return { label: 'Resistances Only', color: '#8b7d6b', passiveDR: 0, soakDie: '—', armorValue: 0 };
};

// === SOAK DIE ===
// Creatures do not have soak dice under the simplified rules
export const getSoakDie = (armor) => {
  return '—';
};

// === BASE ATTACK DIE ===
// Extract primary attack die from creature abilities
export const getBaseAttackDie = (creature) => {
  if (!creature || !creature.abilities) {
    return { formula: '1d6', damageType: 'physical' };
  }
  
  // Find first melee or ranged attack ability
  const attack = creature.abilities.find(a => {
    const type = a.type?.toLowerCase();
    return type === 'melee' || type === 'ranged';
  });
  
  if (attack?.damage) {
    const { diceCount = 1, diceType, bonus = 0, damageType } = attack.damage;
    let formula = `${diceCount}d${diceType}`;
    if (bonus !== 0) {
      formula += bonus > 0 ? `+${bonus}` : `${bonus}`;
    }
    return { formula, damageType: damageType || 'physical' };
  }
  
  // Fallback: Estimate from strength modifier
  const strength = creature.stats?.strength || 10;
  const strMod = Math.floor((strength - 10) / 2);
  let formula = '1d6';
  if (strMod !== 0) {
    formula += strMod > 0 ? `+${strMod}` : `${strMod}`;
  }
  return { formula, damageType: 'physical' };
};

// === SPECIAL MOVEMENT ===
// Get flying/swimming speeds
export const getSpecialMovement = (creature) => {
  const special = [];
  const stats = creature?.stats || {};
  
  if (stats.flying > 0) {
    special.push({ type: 'fly', speed: stats.flying, label: `Fly ${stats.flying}ft` });
  }
  if (stats.swimming > 0) {
    special.push({ type: 'swim', speed: stats.swimming, label: `Swim ${stats.swimming}ft` });
  }
  
  return special;
};

// === RESISTANCES SUMMARY ===
// Format resistances for display
export const getResistancesSummary = (creature) => {
  const result = [];
  const resistances = creature?.resistances || {};
  
  Object.entries(resistances).forEach(([type, value]) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    
    if (value === 'immune' || value === 100) {
      result.push({ type, level: 'immune', label: `${typeLabel} Immune`, color: '#6b3a8a' });
    } else if (value >= 50) {
      result.push({ type, level: 'resistant', label: `${typeLabel} Resistant`, color: '#4a6a8a' });
    } else if (value > 0) {
      result.push({ type, level: 'guarded', label: `${typeLabel} Guarded`, color: '#506e30' });
    }
  });
  
  return result;
};

// === VULNERABILITIES SUMMARY ===
// Format vulnerabilities for display
export const getVulabilitiesSummary = (creature) => {
  const result = [];
  const vulnerabilities = creature?.vulnerabilities || {};
  
  Object.entries(vulnerabilities).forEach(([type, value]) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    
    if (value >= 100) {
      result.push({ type, level: 'vulnerable', label: `${typeLabel} Vulnerable`, color: '#8b3a2a' });
    } else if (value >= 50) {
      result.push({ type, level: 'exposed', label: `${typeLabel} Exposed`, color: '#9a5e15' });
    } else if (value > 0) {
      result.push({ type, level: 'susceptible', label: `${typeLabel} Susceptible`, color: '#7a6812' });
    }
  });
  
  return result;
};

// === DAMAGE TYPE FORMATTING ===
// Format damage type for display
export const formatDamageType = (damageType) => {
  if (!damageType) return '';
  
  const typeColors = {
    physical: '#795548',
    ember: '#a8503a',
    rime: '#3a7a9a',
    storm: '#b8a01f',
    arcane: '#6b3a8a',
    primal: '#506e30',
    blight: '#4A148C',
    wyrd: '#8b2a5a',
    healing: '#2E8B57',
    slashing: '#8b2a2a',
    piercing: '#a52a2a',
    bludgeoning: '#a8531a',
    fire: '#a8503a',
    frost: '#3a7a9a',
    lightning: '#b8a01f',
    thunder: '#6b3a8a',
    acid: '#4a6a2e',
    poison: '#506e30',
    force: '#5a3a8a',
    psychic: '#8b2a5a',
    radiant: '#7a6812',
    necrotic: '#4A148C',
    holy: '#7a6812',
    shadow: '#3a3a3a'
  };
  
  return {
    label: damageType.charAt(0).toUpperCase() + damageType.slice(1),
    color: typeColors[damageType.toLowerCase()] || '#8b7d6b'
  };
};

// === CONDITION SEVERITY ===
// Get condition severity for display priority
export const getConditionSeverity = (conditionName) => {
  const severe = ['stunned', 'paralyzed', 'petrified', 'unconscious', 'incapacitated'];
  const moderate = ['blinded', 'deafened', 'poisoned', 'restrained', 'grappled', 'prone'];
  const minor = ['frightened', 'charmed', 'confused', 'exhausted'];
  
  const name = conditionName.toLowerCase();
  
  if (severe.some(s => name.includes(s))) return 'severe';
  if (moderate.some(m => name.includes(m))) return 'moderate';
  if (minor.some(m => name.includes(m))) return 'minor';
  return 'neutral';
};
