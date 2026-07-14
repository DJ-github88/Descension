/**
 * Skill-Based Actions Data
 *
 * CLEARED FOR TESTING
 * All skill-based actions have been removed and replaced with complete test spells.
 * See testSpells.js for the test spell library.
 *
 * Original actions backed up to: BACKUP_skillBasedActionsData.js
 */

// CLEARED - Using test spells instead
export const SKILL_BASED_ACTIONS = [];

// Export for use in general spells
export const SKILL_ACTIONS_CATEGORY = {
 id: 'skill_actions',
 name: 'Skill Actions',
 description: 'The tools every Apprentice must master before binding their first contract. Actions that use character skills and abilities',
 icon: 'spell_holy_blessingofstrength',
 color: '#6B8E23',
 spells: SKILL_BASED_ACTIONS.map(action => action.id)
};
