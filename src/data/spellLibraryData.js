/**
 * Spell Library Data
 *
 * This file contains predefined spells for the spell library.
 * These spells are created using the spellcrafting wizard format.
 */

// Import custom spells and collections
import { CUSTOM_LIBRARY_SPELLS, SPELL_CATEGORIES } from './customSpellLibraryData';
import { ADDITIONAL_SPELLS } from './additionalSpells';
import { ADVANCED_SPELLS } from './advancedSpells';
import { testBuffSpell } from './testBuffSpell';
import { testDebuffSpell } from './testDebuffSpell';
import { ENHANCED_SPELL_LIBRARY, ALL_ENHANCED_CATEGORIES } from './enhancedSpellLibrary';
import { ADDITIONAL_ENHANCED_SPELLS } from './additionalEnhancedSpells';

// Use our custom spells plus the enhanced library
// Note: These will be formatted automatically by the spell library formatter
export const LIBRARY_SPELLS = [
  ...CUSTOM_LIBRARY_SPELLS,
  ...ADDITIONAL_SPELLS,
  ...ADVANCED_SPELLS,
  ...ENHANCED_SPELL_LIBRARY,
  ...ADDITIONAL_ENHANCED_SPELLS,
  testBuffSpell,
  testDebuffSpell
];

// Define new collections for the additional spells
const ADDITIONAL_COLLECTIONS = [
  // Spell schools
  {
    id: 'storm-spells',
    name: 'Storm Spells',
    description: 'Spells that harness the power of thunder and lightning',
    icon: 'spell_nature_lightning',
    spells: ['thunderous-smite', 'chain-lightning'],
    color: '#4169E1'
  },
  {
    id: 'illusion-spells',
    name: 'Illusion Spells',
    description: 'Spells that create illusions and deceive the senses',
    icon: 'spell_magic_lesserinvisibilty',
    spells: ['mirror-image'],
    color: '#9370DB'
  },
  {
    id: 'divination-spells',
    name: 'Divination Spells',
    description: 'Spells that reveal information and predict the future',
    icon: 'spell_holy_mindvision',
    spells: ['card-divination', 'mind-spike'],
    color: '#4B0082'
  },
  {
    id: 'earth-spells',
    name: 'Earth Spells',
    description: 'Spells that manipulate stone and earth',
    icon: 'spell_nature_stoneclawtotem',
    spells: ['earthen-grasp'],
    color: '#8B4513'
  },
  {
    id: 'necromancy-spells',
    name: 'Necromancy Spells',
    description: 'Spells that manipulate life force and death energy',
    icon: 'spell_shadow_lifedrain02',
    spells: ['vampiric-touch'],
    color: '#800080'
  },

  // Spell types
  {
    id: 'trap-spells',
    name: 'Trap Spells',
    description: 'Spells that can be set as traps to trigger when enemies approach',
    icon: 'spell_frost_frostbolt',
    spells: ['frost-trap', 'volcanic-eruption'],
    color: '#69CCF0'
  },
  {
    id: 'reaction-spells',
    name: 'Reaction Spells',
    description: 'Spells that trigger in response to enemy actions',
    icon: 'ability_warrior_revenge',
    spells: ['venomous-strike'],
    color: '#FF7F50'
  },
  {
    id: 'passive-spells',
    name: 'Passive Spells',
    description: 'Spells that provide ongoing effects without requiring actions',
    icon: 'spell_shadow_detectlesserinvisibility',
    spells: ['mana-shield'],
    color: '#4682B4'
  },
  {
    id: 'coin-spells',
    name: 'Coin Magic',
    description: 'Spells that use coin flips to determine their effects',
    icon: 'inv_misc_coin_01',
    spells: ['coin-flip-fate'],
    color: '#FFD700'
  },
  {
    id: 'multi-target-spells',
    name: 'Multi-Target Spells',
    description: 'Spells that can affect multiple targets at once',
    icon: 'spell_nature_chainlightning',
    spells: ['chain-lightning', 'blade-dance', 'healing-rain'],
    color: '#1E90FF'
  }
];

// Use our custom collections plus the additional ones and enhanced categories
export const LIBRARY_COLLECTIONS = [
  ...SPELL_CATEGORIES,
  ...ADDITIONAL_COLLECTIONS,
  ...ALL_ENHANCED_CATEGORIES
];
