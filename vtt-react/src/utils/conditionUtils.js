/**
 * Utility functions for calculating stat modifications based on conditions
 */
import { movementBreakdown } from '../services/sharedConditionProfile';

/**
 * Calculate effective movement speed based on active conditions
 * @param {number} baseSpeed - The base movement speed
 * @param {Array} conditions - Array of active conditions from token.state.conditions
 * @returns {number} - The effective movement speed after applying condition modifiers
 */
/** Sum of accepted authored movement changes on these exact records (A11: different named effects stack). */
export function authoredMovementFeet(conditions = []) {
 return movementBreakdown(0, conditions).total;
}

export function calculateEffectiveMovementSpeed(baseSpeed, conditions = []) {
 return movementSpeedBreakdown(baseSpeed, conditions).result;
}

/**
 * A11: the same calculation as calculateEffectiveMovementSpeed, returned as readable parts:
 * base → existing condition step (zeroing/multipliers) → each authored movement change → result (≥ 0 ft).
 */
export function movementSpeedBreakdown(baseSpeed, conditions = []) {
 if (!conditions || conditions.length === 0) {
  return { base: baseSpeed, zeroedBy: null, before: baseSpeed, effects: [], total: 0, result: baseSpeed, clamped: false };
 }

 let effectiveSpeed = baseSpeed;
 const conditionIds = conditions.map(c => c.id || c.name?.toLowerCase());

 // Check for conditions that set speed to 0 (highest priority)
 if (conditionIds.includes('stunned') || conditionIds.includes('paralyzed')) {
  return { base: baseSpeed, zeroedBy: conditionIds.includes('stunned') ? 'stunned' : 'paralyzed', before: 0, effects: [], total: 0, result: 0, clamped: false };
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
   // For now, we'll assume it halves speed (level 2)
   // If level 5, it would be handled by the stunned/paralyzed check above
   effectiveSpeed = effectiveSpeed * 0.5;
 }

 // A10: authored movement changes (validated canonical records only) are flat feet added after the
 // multipliers above — the same order the character sheet uses for flat buff/debuff speed effects.
 // Sandbox/legacy records with arbitrary effects are not counted here, so nothing is applied twice.
 // A11: the shared breakdown adds each accepted change, floors, and never goes below 0 (unchanged order).
 return { base: baseSpeed, zeroedBy: null, ...movementBreakdown(effectiveSpeed, conditions) };
}

/** Base walking speed the creature Inspect view and combat movement use for this token (library first). */
export function movementBaseSpeed(token, creatures = []) {
 const library = Array.isArray(creatures) ? creatures.find(creature => creature?.id === token?.creatureId) : null;
 return library?.stats?.speed || token?.creature?.stats?.speed || token?.stats?.speed || 30;
}

/** One readable line: "Base 35 ft · Mired −10 ft · Tailwind +15 ft = 40 ft". */
export function movementBreakdownText(breakdown) {
 if (!breakdown) return '';
 if (breakdown.zeroedBy) return `Base ${breakdown.base} ft · ${breakdown.zeroedBy === 'stunned' ? 'Stunned' : 'Paralyzed'}: no movement = 0 ft`;
 const parts = [`Base ${breakdown.base} ft`];
 if (breakdown.before !== breakdown.base) parts.push(`other conditions → ${breakdown.before} ft`);
 for (const effect of breakdown.effects) parts.push(`${effect.name} ${effect.feet > 0 ? '+' : '−'}${Math.abs(effect.feet)} ft`);
 return `${parts.join(' · ')} = ${breakdown.result} ft${breakdown.clamped ? ' (never below 0 ft)' : ''}`;
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

