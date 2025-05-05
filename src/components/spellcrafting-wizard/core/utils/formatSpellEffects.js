/**
 * Utility function to format spell effects for display in the LibraryStyleSpellCard component
 */

/**
 * Format damage effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted damage effects
 */
export const formatDamageEffects = (spell) => {
  if (!spell) return [];
  
  const effects = [];
  const damageTypes = [];
  
  // Add the school from typeConfig if available
  if (spell.typeConfig?.school) {
    damageTypes.push(spell.typeConfig.school);
  }
  
  // Add additional damage types if available
  if (spell.typeConfig?.secondaryElement) {
    damageTypes.push(spell.typeConfig.secondaryElement);
  }
  
  // Check for direct damage
  if (spell.primaryDamage || (spell.effectType === 'damage' && spell.formula)) {
    // Format damage types with proper capitalization
    let damageTypeText = '';
    if (damageTypes.length > 0) {
      damageTypeText = ' ' + damageTypes.map(type => {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }).join(' & ') + ' damage';
    }
    
    const damageAmount = spell.primaryDamage?.dice || spell.formula || '6d6';
    effects.push(`Direct Damage: ${damageAmount}${damageTypeText}`);
  }
  
  // Check for DoT damage
  if (spell.isDot || spell.hasDotEffect) {
    // Format damage types with proper capitalization
    let damageTypeText = '';
    if (damageTypes.length > 0) {
      damageTypeText = ' ' + damageTypes.map(type => {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }).join(' & ') + ' damage';
    }
    
    const duration = spell.dotDuration || 3;
    const dotTick = spell.dotTick || '1d4';
    effects.push(`Damage over Time: ${dotTick} over ${duration} rounds${damageTypeText}`);
  }
  
  return effects;
};

/**
 * Format healing effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted healing effects
 */
export const formatHealingEffects = (spell) => {
  if (!spell) return [];
  
  const effects = [];
  
  // Check for direct healing
  if (spell.healing || (spell.effectType === 'healing' && spell.formula)) {
    const healAmount = spell.healing?.dice || spell.formula || '6d6';
    effects.push(`Direct Healing: ${healAmount}`);
  }
  
  // Check for HoT
  if (spell.isHot || spell.hasHotEffect) {
    const duration = spell.hotDuration || 3;
    const hotTick = spell.hotTick || '1d4';
    effects.push(`Healing over Time: ${hotTick} for ${duration} rounds`);
  }
  
  // Check for Shield
  if (spell.isShield || spell.hasShieldEffect) {
    const duration = spell.shieldDuration || 3;
    const shieldAmount = spell.shieldAmount || '2d6';
    effects.push(`Shield: ${shieldAmount} for ${duration} rounds`);
  }
  
  return effects;
};

/**
 * Format buff effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted buff effects
 */
export const formatBuffEffects = (spell) => {
  if (!spell || !spell.buffConfig) return [];
  
  const effects = [];
  
  // Add stat modifiers if present
  if (spell.buffConfig.statModifiers && spell.buffConfig.statModifiers.length > 0) {
    spell.buffConfig.statModifiers.forEach(modifier => {
      const effectName = `${modifier.name || 'Stat'} Boost`;
      const buffEffect = `${modifier.magnitude || 2}${modifier.magnitudeType === 'percentage' ? '%' : ''} ${modifier.name || 'stat'} increase`;
      
      // Format duration
      let duration = '';
      if (spell.buffConfig.durationType === 'rest') {
        if (spell.buffConfig.restType === 'short') {
          duration = 'until short rest';
        } else if (spell.buffConfig.restType === 'long') {
          duration = 'until long rest';
        }
      } else if (spell.buffConfig.durationType === 'permanent') {
        duration = 'permanent';
      } else {
        duration = `${spell.buffConfig.durationValue || spell.buffConfig.duration || 3} ${spell.buffConfig.durationUnit || 'rounds'}`;
      }
      
      effects.push(`${effectName}: ${buffEffect}${duration ? ` for ${duration}` : ''}`);
    });
  }
  
  return effects;
};

/**
 * Format debuff effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Array} - Formatted debuff effects
 */
export const formatDebuffEffects = (spell) => {
  if (!spell || !spell.debuffConfig) return [];
  
  const effects = [];
  
  // Add stat penalties if present
  if (spell.debuffConfig.statPenalties && spell.debuffConfig.statPenalties.length > 0) {
    spell.debuffConfig.statPenalties.forEach(penalty => {
      const effectName = `${penalty.name || 'Stat'} Reduction`;
      const debuffEffect = `${penalty.magnitude || 2}${penalty.magnitudeType === 'percentage' ? '%' : ''} ${penalty.name || 'stat'} decrease`;
      
      // Format duration
      let duration = '';
      if (spell.debuffConfig.durationType === 'rest') {
        if (spell.debuffConfig.restType === 'short') {
          duration = 'until short rest';
        } else if (spell.debuffConfig.restType === 'long') {
          duration = 'until long rest';
        }
      } else if (spell.debuffConfig.durationType === 'permanent') {
        duration = 'permanent';
      } else {
        duration = `${spell.debuffConfig.durationValue || spell.debuffConfig.duration || 3} ${spell.debuffConfig.durationUnit || 'rounds'}`;
      }
      
      effects.push(`${effectName}: ${debuffEffect}${duration ? ` for ${duration}` : ''}`);
    });
  }
  
  return effects;
};

/**
 * Format all effects for a spell
 * @param {Object} spell - The spell object
 * @returns {Object} - Formatted effects
 */
export const formatAllEffects = (spell) => {
  return {
    damageEffects: formatDamageEffects(spell),
    healingEffects: formatHealingEffects(spell),
    buffEffects: formatBuffEffects(spell),
    debuffEffects: formatDebuffEffects(spell)
  };
};
