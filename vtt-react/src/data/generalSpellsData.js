/**
 * General Spells Data
 *
 * CLEARED FOR TESTING
 * All general spells have been removed and replaced with comprehensive test spells.
 * See testSpells.js for the test spell library.
 *
 * Original spells backed up to: BACKUP_generalSpellsData.js
 */

import { ALL_TEST_SPELLS, TEST_SPELL_CATEGORIES } from './testSpells';

// CLEARED - Using test spells instead
export const GENERAL_SPELLS = [];

// Combine all general actions - using test spells
export const ALL_GENERAL_SPELLS = ALL_TEST_SPELLS;

// Export the general spells category
export const GENERAL_SPELLS_CATEGORY = {
  id: 'test_spells',
  name: 'Test Spells',
  description: 'Comprehensive test spells for verifying spell wizard formatting',
  icon: 'inv_misc_dice_01',
  color: '#8B4513',
  spells: ALL_TEST_SPELLS.map(spell => spell.id)
};

// Export categories for organization
export const GENERAL_CATEGORIES = TEST_SPELL_CATEGORIES;
