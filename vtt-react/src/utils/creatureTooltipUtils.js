// Creature Tooltip Utility Functions
// Provides classification and formatting for creature token tooltips

// === HEALTH STATE ===
// Returns qualitative health state based on HP percentage
export const getHealthState = (currentHp, maxHp) => {
  if (maxHp <= 0) return { label: 'Unknown', color: '#9E9E9E', pct: 0, barFill: 0 };
  
  const pct = (currentHp / maxHp) * 100;
  const barFill = Math.max(0, Math.min(100, pct));
  
  if (currentHp <= 0) return { label: 'Defeated', color: '#9E9E9E', pct: 0, barFill: 0 };
  if (pct === 100) return { label: 'Pristine', color: '#4CAF50', pct, barFill };
  if (pct >= 75) return { label: 'Healthy', color: '#8BC34A', pct, barFill };
  if (pct >= 50) return { label: 'Wounded', color: '#FF9800', pct, barFill };
  if (pct >= 25) return { label: 'Bloodied', color: '#FF5722', pct, barFill };
  if (pct >= 10) return { label: 'Critical', color: '#F44336', pct, barFill };
  return { label: "Death's Door", color: '#B71C1C', pct, barFill };
};

// === SPEED RATING ===
// Returns qualitative speed description
export const getSpeedRating = (speed) => {
  if (speed === 0) return { label: 'Immobile', color: '#9E9E9E', icon: '🚫' };
  if (speed <= 15) return { label: 'Crippled', color: '#F44336', icon: '🩹' };
  if (speed <= 25) return { label: 'Slow', color: '#FF9800', icon: '🐢' };
  if (speed <= 35) return { label: 'Normal', color: '#E0E0E0', icon: '🚶' };
  if (speed <= 50) return { label: 'Fast', color: '#64B5F6', icon: '🏃' };
  if (speed <= 70) return { label: 'Swift', color: '#2196F3', icon: '💨' };
  return { label: 'Blazing', color: '#00BCD4', icon: '⚡' };
};

// === ARMOR RATING ===
// Returns qualitative armor description for creatures (resistances only)
export const getArmorRating = (armor) => {
  return { label: 'Resistances Only', color: '#9e9e9e', passiveDR: 0, soakDie: '—', armorValue: 0 };
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
      result.push({ type, level: 'immune', label: `${typeLabel} Immune`, color: '#9C27B0' });
    } else if (value >= 50) {
      result.push({ type, level: 'resistant', label: `${typeLabel} Resistant`, color: '#2196F3' });
    } else if (value > 0) {
      result.push({ type, level: 'guarded', label: `${typeLabel} Guarded`, color: '#4CAF50' });
    }
  });
  
  return result;
};

// === VULNERABILITIES SUMMARY ===
// Format vulnerabilities for display
export const getVulnerabilitiesSummary = (creature) => {
  const result = [];
  const vulnerabilities = creature?.vulnerabilities || {};
  
  Object.entries(vulnerabilities).forEach(([type, value]) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    
    if (value >= 100) {
      result.push({ type, level: 'vulnerable', label: `${typeLabel} Vulnerable`, color: '#F44336' });
    } else if (value >= 50) {
      result.push({ type, level: 'exposed', label: `${typeLabel} Exposed`, color: '#FF9800' });
    } else if (value > 0) {
      result.push({ type, level: 'susceptible', label: `${typeLabel} Susceptible`, color: '#FFC107' });
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
    ember: '#FF5722',
    rime: '#03A9F4',
    storm: '#FFEB3B',
    arcane: '#9C27B0',
    primal: '#4CAF50',
    blight: '#4A148C',
    wyrd: '#E91E63',
    healing: '#2E8B57',
    slashing: '#B71C1C',
    piercing: '#D32F2F',
    bludgeoning: '#E64A19',
    fire: '#FF5722',
    frost: '#03A9F4',
    lightning: '#FFEB3B',
    thunder: '#9C27B0',
    acid: '#8BC34A',
    poison: '#4CAF50',
    force: '#673AB7',
    psychic: '#E91E63',
    radiant: '#FFD700',
    necrotic: '#4A148C',
    holy: '#FFD700',
    shadow: '#263238'
  };
  
  return {
    label: damageType.charAt(0).toUpperCase() + damageType.slice(1),
    color: typeColors[damageType.toLowerCase()] || '#9E9E9E'
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
