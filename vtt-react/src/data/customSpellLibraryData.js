/**
 * Custom Spell Library Data
 *
 * COMPLETELY REWRITTEN - Showcase spells demonstrating ALL spell wizard capabilities
 * Each spell is fully configured with proper formatting and complete effect details
 */

// Helper to generate unique IDs
const generateId = (name) => `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

// EMPTY - Spells are now in testSpells.js
// This file is no longer used for spell library population
export const CUSTOM_LIBRARY_SPELLS = [];

// Spell categories for organization
export const SPELL_CATEGORIES = [
  {
    id: 'damage-spells',
    name: 'Damage Spells',
    description: 'Spells that deal direct damage to enemies',
    icon: 'spell_fire_fireball02',
    spells: [],
    color: '#8B4513'
  },
  {
    id: 'healing-spells',
    name: 'Healing Spells',
    description: 'Spells that restore health and vitality',
    icon: 'spell_holy_heal',
    spells: [],
    color: '#2d5016'
  },
  {
    id: 'buff-spells',
    name: 'Buff Spells',
    description: 'Spells that enhance allies with beneficial effects',
    icon: 'spell_holy_devotion',
    spells: [],
    color: '#5a1e12'
  },
  {
    id: 'control-spells',
    name: 'Control Spells',
    description: 'Spells that control and disable enemies',
    icon: 'spell_frost_frostarmor',
    spells: [],
    color: '#3b82f6'
  },
  {
    id: 'utility-spells',
    name: 'Utility Spells',
    description: 'Spells that provide various utility effects',
    icon: 'spell_arcane_teleportundercity',
    spells: [],
    color: '#8b5cf6'
  },
  {
    id: 'summoning-spells',
    name: 'Summoning Spells',
    description: 'Spells that summon creatures and allies',
    icon: 'spell_shadow_summonvoidwalker',
    spells: [],
    color: '#6366f1'
  },
  {
    id: 'transformation-spells',
    name: 'Transformation Spells',
    description: 'Spells that transform the caster or allies',
    icon: 'ability_druid_catform',
    spells: [],
    color: '#10b981'
  },
  {
    id: 'reaction-spells',
    name: 'Reaction Spells',
    description: 'Spells triggered by specific events',
    icon: 'ability_warrior_revenge',
    spells: [],
    color: '#f59e0b'
  },
  {
    id: 'trap-spells',
    name: 'Trap Spells',
    description: 'Spells that place traps and hazards',
    icon: 'spell_fire_selfdestruct',
    spells: [],
    color: '#ef4444'
  },
  {
    id: 'wild-magic',
    name: 'Wild Magic',
    description: 'Spells with unpredictable random effects',
    icon: 'spell_arcane_arcane04',
    spells: [],
    color: '#ec4899'
  }
];

