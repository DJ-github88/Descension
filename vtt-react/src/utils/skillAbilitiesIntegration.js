/**
 * Skill Abilities Integration Utility
 * 
 * Provides functions to integrate skill-based abilities into character spellbooks
 */

import { getAvailableSkillAbilities } from '../data/skillAbilitiesData';

/**
 * Get all skill abilities available to a character based on their skill proficiencies
 * @param {Object} skillRanks - Object mapping skill IDs to their ranks (e.g., { acrobatics: 'NOVICE', ... })
 * @returns {Array} Array of skill ability spell objects
 */
export const getCharacterSkillAbilities = (skillRanks) => {
  if (!skillRanks) return [];
  
  return getAvailableSkillAbilities(skillRanks);
};

/**
 * Get skill abilities grouped by skill
 * @param {Object} skillRanks - Object mapping skill IDs to their ranks
 * @returns {Object} Object mapping skill IDs to arrays of abilities
 */
export const getSkillAbilitiesBySkill = (skillRanks) => {
  const abilities = getCharacterSkillAbilities(skillRanks);
  const grouped = {};
  
  abilities.forEach(ability => {
    const skillId = ability.skillRequirement?.skillId;
    if (skillId) {
      if (!grouped[skillId]) {
        grouped[skillId] = [];
      }
      grouped[skillId].push(ability);
    }
  });
  
  return grouped;
};

/**
 * Check if a character has any skill abilities available
 * @param {Object} skillRanks - Object mapping skill IDs to their ranks
 * @returns {boolean}
 */
export const hasSkillAbilities = (skillRanks) => {
  return getCharacterSkillAbilities(skillRanks).length > 0;
};

/**
 * Get skill abilities formatted for spellbook display
 * These can be added to the character's spell library
 * @param {Object} skillRanks - Object mapping skill IDs to their ranks
 * @returns {Array} Array of spell objects ready for spellbook
 */
export const getSkillAbilitiesForSpellbook = (skillRanks) => {
  const abilities = getCharacterSkillAbilities(skillRanks);
  
  // Ensure each ability has required fields for spellbook display
  return abilities.map(ability => ({
    ...ability,
    // Ensure categoryIds for spell library organization
    categoryIds: ability.categoryIds || ['skill_abilities'],
    // Mark as skill ability for filtering
    isSkillAbility: true,
    // Source information
    source: 'skill_proficiency',
    sourceSkill: ability.skillRequirement?.skillId
  }));
};

