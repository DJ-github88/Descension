/**
 * Utility functions for calculating stat modifications based on conditions
 */

/**
 * Calculate effective movement speed based on active conditions
 * @param {number} baseSpeed - The base movement speed
 * @param {Array} conditions - Array of active conditions from token.state.conditions
 * @returns {number} - The effective movement speed after applying condition modifiers
 */
export function calculateEffectiveMovementSpeed(baseSpeed, conditions = []) {
  if (!conditions || conditions.length === 0) {
    return baseSpeed;
  }

  let effectiveSpeed = baseSpeed;
  const conditionIds = conditions.map(c => c.id || c.name?.toLowerCase());

  // Check for conditions that set speed to 0 (highest priority)
  if (conditionIds.includes('stunned') || conditionIds.includes('paralyzed')) {
    return 0;
  }

  // Apply multiplicative modifiers in order
  // Hasted: doubles speed
  if (conditionIds.includes('hasted')) {
    effectiveSpeed = effectiveSpeed * 2;
  }

  // Slowed: halves speed
  if (conditionIds.includes('slowed')) {
    effectiveSpeed = effectiveSpeed * 0.5;
  }

  // Restrained: movement is restricted (halve speed, does NOT set to 0)
  if (conditionIds.includes('restrained')) {
    effectiveSpeed = effectiveSpeed * 0.5;
  }

  // Exhausted: already handled in characterUtils for character tokens,
  // but if it's also applied as a condition, we should respect it
  // Level 2 exhaustion halves speed, level 5 sets to 0
  if (conditionIds.includes('exhausted')) {
    // Check if there's a severity or level indicator
    const exhaustedCondition = conditions.find(c => 
      (c.id || c.name?.toLowerCase()) === 'exhausted'
    );
    // For now, we'll assume it halves speed (level 2)
    // If level 5, it would be handled by the stunned/paralyzed check above
    effectiveSpeed = effectiveSpeed * 0.5;
  }

  // Return the effective speed, ensuring it's at least 0
  return Math.max(0, Math.floor(effectiveSpeed));
}

/**
 * Get condition-based stat modifications
 * This can be extended for other stats like armor, damage, etc.
 * @param {Object} baseStats - The base stats object
 * @param {Array} conditions - Array of active conditions
 * @returns {Object} - Modified stats object
 */
export function applyConditionStatModifiers(baseStats, conditions = []) {
  if (!conditions || conditions.length === 0) {
    return { ...baseStats };
  }

  const modifiedStats = { ...baseStats };
  const conditionIds = conditions.map(c => c.id || c.name?.toLowerCase());

  // Apply movement speed modifications
  if (baseStats.speed !== undefined) {
    modifiedStats.speed = calculateEffectiveMovementSpeed(baseStats.speed, conditions);
  }
  if (baseStats.moveSpeed !== undefined) {
    modifiedStats.moveSpeed = calculateEffectiveMovementSpeed(baseStats.moveSpeed, conditions);
  }
  if (baseStats.movementSpeed !== undefined) {
    modifiedStats.movementSpeed = calculateEffectiveMovementSpeed(baseStats.movementSpeed, conditions);
  }

  // Apply defending condition (increases armor)
  if (conditionIds.includes('defending')) {
    // Defending typically adds +2 armor (as seen in CreatureToken.jsx)
    modifiedStats.armor = (modifiedStats.armor || 0) + 2;
  }

  return modifiedStats;
}

/**
 * Check if a token can move based on conditions
 * @param {Array} conditions - Array of active conditions
 * @returns {boolean} - True if the token can move, false otherwise
 */
export function canTokenMove(conditions = []) {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  const conditionIds = conditions.map(c => c.id || c.name?.toLowerCase());
  
  // Stunned and Paralyzed prevent movement
  if (conditionIds.includes('stunned') || conditionIds.includes('paralyzed')) {
    return false;
  }

  return true;
}

