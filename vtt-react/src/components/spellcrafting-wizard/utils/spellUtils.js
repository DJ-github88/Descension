/**
 * Utility functions for working with spell data in the spell crafting wizard
 */

/**
 * Gets the CSS class name for a given spell school
 * @param {string} school - The spell's school of magic
 * @returns {string} - The CSS class name for the school
 */
export const getSchoolClassName = (school) => {
  if (!school) return '';
  
  // Convert to lowercase and remove spaces/special characters
  return school.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

/**
 * Formats duration configuration into human-readable text
 * @param {Object} durationConfig - The duration configuration object
 * @returns {string} - Formatted duration text
 */
export const formatDuration = (durationConfig) => {
  if (!durationConfig || !durationConfig.durationType) {
    return 'Instant';
  }

  const { durationType, durationAmount, durationUnit } = durationConfig;
  
  switch (durationType) {
    case 'instant':
      return 'Instant';
      
    case 'timed':
      if (!durationAmount) return 'Instant';
      
      // Handle duration units
      const unit = durationUnit || 'rounds';
      const unitText = durationAmount === 1 
        ? unit.slice(0, -1) // Remove 's' for singular
        : unit;
        
      return `${durationAmount} ${unitText}`;
      
    case 'permanent':
      return 'Permanent';
      
    case 'channeled':
      return 'While channeled';
      
    case 'concentration':
      return `${durationAmount || ''} ${durationUnit || 'rounds'} (Concentration)`;
      
    case 'over-time':
      return `${durationAmount || ''} ${durationUnit || 'rounds'} (over time)`;
      
    default:
      return 'Instant';
  }
};

/**
 * Formats targeting configuration into a human-readable range text
 * @param {Object} targetingConfig - The targeting configuration object
 * @returns {string} - Formatted range text
 */
export const formatRange = (targetingConfig) => {
  if (!targetingConfig || !targetingConfig.rangeType) {
    return 'Self';
  }
  
  const { rangeType, rangeDistance, targetingType, areaType, areaSize } = targetingConfig;
  
  switch (rangeType) {
    case 'self':
      return 'Self';
      
    case 'touch':
      return 'Touch';
      
    case 'melee':
      return 'Melee';
      
    case 'ranged':
      let rangeText = `${rangeDistance || 30} ft`;
      
      // Add area info for area spells
      if (targetingType === 'area' && areaType) {
        const formattedAreaType = areaType.charAt(0).toUpperCase() + areaType.slice(1);
        rangeText += ` (${formattedAreaType}: ${areaSize || 10} ft)`;
      }
      
      return rangeText;
      
    default:
      return 'Self';
  }
};

/**
 * Gets the appropriate icon for a spell effect type
 * @param {string} effectType - The type of effect
 * @returns {string} - FontAwesome icon class
 */
export const getEffectIcon = (effectType) => {
  switch (effectType) {
    case 'damage': return 'fa-fire';
    case 'healing': return 'fa-heart';
    case 'buff': return 'fa-hand-sparkles';
    case 'debuff': return 'fa-skull';
    case 'utility': return 'fa-wand-magic-sparkles';
    case 'control': return 'fa-snowflake';
    default: return 'fa-bolt';
  }
};

/**
 * Formats resource cost information into a readable string
 * @param {Object} resourceConfig - The resource configuration object
 * @returns {string} - Formatted resource cost text
 */
export const formatResourceCost = (resourceConfig) => {
  if (!resourceConfig || !resourceConfig.resourceAmount) {
    return 'None';
  }
  
  const { resourceType, resourceAmount } = resourceConfig;
  return `${resourceAmount} ${resourceType || 'Mana'}`;
};

/**
 * Formats cooldown information into a readable string
 * @param {Object} cooldownConfig - The cooldown configuration object
 * @returns {string} - Formatted cooldown text
 */
export const formatCooldown = (cooldownConfig) => {
  if (!cooldownConfig || !cooldownConfig.cooldownTime) {
    return 'None';
  }
  
  let text = cooldownConfig.cooldownTime;
  
  if (cooldownConfig.charges && cooldownConfig.charges > 1) {
    text += ` (${cooldownConfig.charges} charges)`;
  }
  
  return text;
};
