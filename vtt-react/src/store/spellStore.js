import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createStorageConfig } from '../utils/storageUtils';

// Spell types
export const SPELL_TYPES = {
  ACTION: 'ACTION',
  CHANNELED: 'CHANNELED',
  PASSIVE: 'PASSIVE',
  REACTION: 'REACTION',
  TRAP: 'TRAP',
  STATE: 'STATE'
};

// Damage types — canonical Mythrill vocabulary.
// Legacy constant names are kept as aliases pointing at canonical values so
// existing consumer code keeps working; new code should use the canonical names.
export const DAMAGE_TYPES = {
  SMASHING: 'smashing',
  BLUDGEONING: 'smashing',
  PHYSICAL: 'smashing',
  STABBING: 'stabbing',
  PIERCING: 'stabbing',
  RANGED: 'stabbing',
  SLICING: 'slicing',
  SLASHING: 'slicing',
  EMBER: 'ember',
  FIRE: 'ember',
  RIME: 'rime',
  FROST: 'rime',
  COLD: 'rime',
  ICE: 'rime',
  STORM: 'storm',
  LIGHTNING: 'storm',
  THUNDER: 'storm',
  ELECTRIC: 'storm',
  PRIMAL: 'primal',
  NATURE: 'primal',
  ARCANE: 'arcane',
  FORCE: 'arcane',
  BLIGHT: 'blight',
  NECROTIC: 'blight',
  SHADOW: 'blight',
  VOID: 'blight',
  POISON: 'blight',
  ACID: 'blight',
  WYRD: 'wyrd',
  PSYCHIC: 'wyrd',
  CHAOS: 'wyrd',
  SACRED: 'sacred',
  RADIANT: 'sacred',
  HOLY: 'sacred',
  DIVINE: 'sacred',
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
    createStorageConfig('spell-store')
  )
);

export default useSpellStore;
