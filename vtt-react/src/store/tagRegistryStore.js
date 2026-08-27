import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Universal Tag Registry Store
 * Allows any entity (NPC, Faction, Location, Quest, Family Node, Custom Lineage, Journal Article, Item, Spell, Creature)
 * to have dynamic tags, query across systems, and build relationship indexing without mutating static lore files.
 */
export const useTagRegistryStore = create(
  persist(
    (set, get) => ({
      // User-assigned custom tags: { [`${entityType}:${entityId}`]: string[] }
      customTags: {},

      // Tag metadata (color, icon, category, description): { [tagKey]: { name, color, icon, category, description } }
      tagMetadata: {
        'noble': { name: 'Noble', color: '#eab308', icon: 'fa-crown', category: 'Social' },
        'nordhalla': { name: 'Nordhalla', color: '#38bdf8', icon: 'fa-snowflake', category: 'Region' },
        'frostwood': { name: 'Frostwood Reach', color: '#34d399', icon: 'fa-tree', category: 'Region' },
        'alduin': { name: 'House Alduin', color: '#f59e0b', icon: 'fa-shield', category: 'Dynasty' },
        'thalreth': { name: 'House Thalreth', color: '#a855f7', icon: 'fa-scroll', category: 'Dynasty' },
        'wyrd': { name: 'Wyrd Magic', color: '#ec4899', icon: 'fa-wand-magic-sparkles', category: 'Magic' },
        'undead': { name: 'Undead', color: '#94a3b8', icon: 'fa-skull', category: 'Creature' },
        'secret': { name: 'Secret / Hidden', color: '#ef4444', icon: 'fa-mask', category: 'GM' },
        'quest-hook': { name: 'Quest Hook', color: '#f97316', icon: 'fa-compass', category: 'Campaign' }
      },

      // Add a custom tag to an entity
      addTagToEntity: (entityType, entityId, rawTag) => {
        if (!entityType || !entityId || !rawTag) return;
        const tag = rawTag.toLowerCase().trim().replace(/^#/, '');
        if (!tag) return;

        const key = `${entityType}:${entityId}`;
        const currentTags = get().customTags[key] || [];
        if (currentTags.includes(tag)) return;

        set((state) => ({
          customTags: {
            ...state.customTags,
            [key]: [...currentTags, tag]
          }
        }));
      },

      // Remove a custom tag from an entity
      removeTagFromEntity: (entityType, entityId, rawTag) => {
        if (!entityType || !entityId || !rawTag) return;
        const tag = rawTag.toLowerCase().trim().replace(/^#/, '');
        const key = `${entityType}:${entityId}`;
        const currentTags = get().customTags[key] || [];

        set((state) => ({
          customTags: {
            ...state.customTags,
            [key]: currentTags.filter((t) => t !== tag)
          }
        }));
      },

      // Set tag metadata (custom colors/icons)
      setTagMetadata: (rawTag, meta) => {
        const tag = rawTag.toLowerCase().trim().replace(/^#/, '');
        set((state) => ({
          tagMetadata: {
            ...state.tagMetadata,
            [tag]: { ...(state.tagMetadata[tag] || {}), ...meta, name: meta.name || tag }
          }
        }));
      },

      // Get user-assigned tags for entity
      getCustomTags: (entityType, entityId) => {
        const key = `${entityType}:${entityId}`;
        return get().customTags[key] || [];
      },

      // Clear all custom tags (e.g. for blank slate campaign)
      clearCustomTags: () => {
        set({ customTags: {} });
      }
    }),
    {
      name: 'mythrill-universal-tag-registry',
      version: 1
    }
  )
);

export default useTagRegistryStore;
