import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'mythrill-custom-summons';

const useCustomSummonStore = create(
  persist(
    (set, get) => ({
      customTemplates: [],

      createTemplate: (data) => {
        const template = {
          id: `custom_${uuidv4()}`,
          isCustom: true,
          dateCreated: Date.now(),
          lastModified: Date.now(),
          ...data,
        };
        set((state) => ({
          customTemplates: [...state.customTemplates, template],
        }));
        return template;
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          customTemplates: state.customTemplates.map((t) =>
            t.id === id ? { ...t, ...updates, lastModified: Date.now() } : t
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
        }));
      },

      getTemplatesForCharacter: (character) => {
        const { customTemplates } = get();
        const classId = character?.characterClass?.toLowerCase().trim();
        const charId = character?.id || character?.characterId;
        return customTemplates.filter((t) => {
          if (t.characterId && t.characterId !== charId) return false;
          if (!t.classId && !t.characterId) return true;
          return t.classId === classId;
        });
      },

      getTemplatesForClass: (classId) => {
        const { customTemplates } = get();
        const normalized = classId?.toLowerCase().trim();
        return customTemplates.filter((t) => t.classId === normalized);
      },

      getTemplateById: (id) => {
        return get().customTemplates.find((t) => t.id === id);
      },
    }),
    {
      name: STORAGE_KEY,
      getStorage: () => localStorage,
    }
  )
);

export default useCustomSummonStore;
