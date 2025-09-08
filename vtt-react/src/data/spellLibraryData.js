/**
 * Spell Library Data
 *
 * This file contains the local spell library.
 * Users create their own spells using the spell wizard, import spells,
 * or download spells from the community tab.
 */

// Empty spell library - users will populate it themselves
export const LIBRARY_SPELLS = [];

// Simple collections for organizing spells - users will populate these
export const LIBRARY_COLLECTIONS = [
  {
    id: 'damage-spells',
    name: 'Damage Spells',
    description: 'Spells that deal damage to enemies',
    icon: 'spell_fire_fireball02',
    spells: [],
    color: '#8B4513'
  },
  {
    id: 'healing-spells',
    name: 'Healing Spells',
    description: 'Spells that restore health',
    icon: 'spell_holy_heal',
    spells: [],
    color: '#2d5016'
  },
  {
    id: 'utility-spells',
    name: 'Utility Spells',
    description: 'Spells that provide various utility effects',
    icon: 'spell_arcane_teleportundercity',
    spells: [],
    color: '#5a1e12'
  },
  {
    id: 'control-spells',
    name: 'Control Spells',
    description: 'Spells that control enemies or the battlefield',
    icon: 'spell_frost_frostbolt',
    spells: [],
    color: '#00CED1'
  },
  {
    id: 'summoning-spells',
    name: 'Summoning Spells',
    description: 'Spells that summon creatures or objects',
    icon: 'spell_shadow_summonvoidwalker',
    spells: [],
    color: '#9370DB'
  }
];
