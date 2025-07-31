import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Spell types
export const SPELL_TYPES = {
  ACTION: 'ACTION',
  CHANNELED: 'CHANNELED',
  PASSIVE: 'PASSIVE',
  REACTION: 'REACTION',
  TRAP: 'TRAP',
  STATE: 'STATE'
};

// Damage types
export const DAMAGE_TYPES = {
  PHYSICAL: 'physical',
  FIRE: 'fire',
  FROST: 'frost',
  ARCANE: 'arcane',
  NATURE: 'nature',
  SHADOW: 'shadow',
  HOLY: 'holy',
  POISON: 'poison',
  LIGHTNING: 'lightning',
  NECROTIC: 'necrotic',
  RADIANT: 'radiant',
  PSYCHIC: 'psychic',
  ACID: 'acid',
  FORCE: 'force',
  THUNDER: 'thunder',
  BLUDGEONING: 'bludgeoning',
  PIERCING: 'piercing',
  SLASHING: 'slashing'
};

// Sample spells for testing
const SAMPLE_SPELLS = [
  {
    id: 'fireball-spell',
    name: 'Fireball',
    type: SPELL_TYPES.ACTION,
    description: 'A ball of fire that explodes on impact, dealing damage to all targets in the area.',
    damage: {
      diceCount: 8,
      diceType: 6,
      bonus: 0,
      damageType: DAMAGE_TYPES.FIRE
    },
    range: 120,
    actionPointCost: 1,
    cooldown: 0,
    tags: ['fire', 'aoe', 'damage']
  },
  {
    id: 'healing-word-spell',
    name: 'Healing Word',
    type: SPELL_TYPES.ACTION,
    description: 'A word of divine power that heals a creature you can see within range.',
    healing: {
      diceCount: 1,
      diceType: 4,
      bonus: 0
    },
    range: 60,
    actionPointCost: 1,
    cooldown: 0,
    tags: ['healing', 'support']
  },
  {
    id: 'shield-spell',
    name: 'Shield',
    type: SPELL_TYPES.REACTION,
    description: 'An invisible barrier of magical force appears and protects you.',
    effects: [
      {
        type: 'buff',
        stat: 'armorClass',
        value: 5,
        duration: 1
      }
    ],
    range: 0,
    actionPointCost: 1,
    cooldown: 0,
    tags: ['protection', 'buff']
  },
  {
    id: 'magic-missile-spell',
    name: 'Magic Missile',
    type: SPELL_TYPES.ACTION,
    description: 'You create three glowing darts of magical force that unerringly strike their targets.',
    damage: {
      diceCount: 1,
      diceType: 4,
      bonus: 1,
      damageType: DAMAGE_TYPES.FORCE
    },
    range: 120,
    actionPointCost: 1,
    cooldown: 0,
    tags: ['force', 'damage']
  },
  {
    id: 'bless-spell',
    name: 'Bless',
    type: SPELL_TYPES.ACTION,
    description: 'You bless up to three creatures of your choice within range.',
    effects: [
      {
        type: 'buff',
        stat: 'attackRoll',
        value: '1d4',
        duration: 10
      },
      {
        type: 'buff',
        stat: 'savingThrow',
        value: '1d4',
        duration: 10
      }
    ],
    range: 30,
    actionPointCost: 1,
    cooldown: 0,
    tags: ['buff', 'support']
  }
];

const useSpellStore = create(
  persist(
    (set, get) => ({
      // Spell Library state
      spells: [...SAMPLE_SPELLS],
      selectedSpell: null,
      
      // Filters
      filters: {
        query: '',
        types: [],
        tags: []
      },
      
      // Sort order
      sortOrder: {
        field: 'name',
        direction: 'asc'
      },
      
      // Actions
      addSpell: (spell) => set(state => {
        const newSpell = {
          ...spell,
          id: spell.id || uuidv4(),
          dateCreated: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        
        return {
          spells: [...state.spells, newSpell],
          selectedSpell: newSpell.id
        };
      }),
      
      updateSpell: (id, updates) => set(state => ({
        spells: state.spells.map(spell => 
          spell.id === id 
            ? { 
                ...spell, 
                ...updates, 
                lastModified: new Date().toISOString() 
              } 
            : spell
        )
      })),
      
      deleteSpell: (id) => set(state => ({
        spells: state.spells.filter(spell => spell.id !== id),
        selectedSpell: state.selectedSpell === id ? null : state.selectedSpell
      })),
      
      selectSpell: (id) => set({
        selectedSpell: id
      }),
      
      filterSpells: (filters) => set(state => ({
        filters: {
          ...state.filters,
          ...filters
        }
      })),
      
      sortSpells: (sortOrder) => set({
        sortOrder
      }),
      
      clearFilters: () => set({
        filters: {
          query: '',
          types: [],
          tags: []
        }
      })
    }),
    {
      name: 'spell-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);

export default useSpellStore;
