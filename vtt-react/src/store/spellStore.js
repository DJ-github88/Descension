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
  FIRE: 'fire',
  FROST: 'frost',
  ARCANE: 'arcane',
  NATURE: 'nature',
  POISON: 'poison',
  LIGHTNING: 'lightning',
  NECROTIC: 'necrotic',
  RADIANT: 'radiant',
  PSYCHIC: 'psychic',
  FORCE: 'force',
  CHAOS: 'chaos',
  VOID: 'void',
  BLUDGEONING: 'bludgeoning',
  PIERCING: 'piercing',
  SLASHING: 'slashing',
  HEALING: 'healing',
};

const useSpellStore = create(
  persist(
    (set, get) => ({
      // Spell Library state - empty for user-only system
      spells: [], // No longer loading SAMPLE_SPELLS - users create their own
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
