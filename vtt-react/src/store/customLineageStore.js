import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';

const STORAGE_KEY = 'mythrill_custom_lineages';

export const LINEAGE_TEMPLATE = {
  id: '',
  name: 'New Lineage',
  essence: 'The Unbound',
  illustration: '',
  illustrationCaption: '',
  cardFlavor: 'A newly forged bloodline walking the frozen ruins of Mythrill.',
  visualDescription: '',
  description: '',
  culturalBackground: '',
  relationToSunDeath: '',
  originRegionId: 'frostwood-reach',
  affiliatedFactionIds: [],
  
  // VTT Base Stats & Mechanics
  baseTraits: {
    size: 'Medium',
    sizeCategory: 'Medium',
    baseSpeed: 30,
    baseHp: 25,
    baseMana: 15,
    baseAp: 3,
    lifespan: '60-100 years',
    languages: ['Common'],
    height: "5'4\" - 6'2\"",
    weight: '130-220 lbs',
    build: 'Athletic and weathered'
  },
  abilityModifiers: {
    STR: 0,
    AGI: 0,
    CON: 0,
    INT: 0,
    SPI: 0,
    CHA: 0
  },
  
  // AP Mechanics & Passives
  racialPassives: [
    {
      id: 'passive_1',
      name: 'Resilient Blood',
      description: '+1 to Spirit saving throws against fear and environmental hazards.'
    }
  ],
  racialAbilities: [
    {
      id: 'action_1',
      name: 'Surge of Will',
      actionPointCost: 2,
      manaCost: 0,
      school: 'Arcane',
      cooldownType: 'encounter',
      damage: '',
      range: 'Self',
      description: 'Spend 2 AP to shake off a minor condition and gain temporary momentum.'
    }
  ],
  meaningfulTradeoffs: 'Takes +15% additional damage from severe environmental Void or Rime strain.',
  
  // Regional Subraces / Bloodlines
  subraces: [
    {
      id: 'subrace_1',
      name: 'Deep-Bred',
      description: 'Adapted to underground tunnels and geothermal hollows.',
      perks: ['Darkvision 30ft', '+1 CON']
    }
  ],
  
  isCustom: true,
  createdAt: null,
  updatedAt: null
};

// Default preset lineages (empty by default)
export const PRESET_LINEAGES = [];

const triggerLineageAutoSync = () => {
  const currentUid = auth?.currentUser?.uid;
  if (currentUid && currentUid !== 'admin-dev-user' && currentUid !== 'dev-user-123' && !currentUid.startsWith('guest-')) {
    useCustomLineageStore.getState().syncToCloud(currentUid);
  }
};

const useCustomLineageStore = create(
  persist(
    (set, get) => ({
      lineages: [],
      selectedLineageId: null,
      isWizardOpen: false,
      wizardDraft: null,
      lastCloudSyncAt: null,

      openWizard: (initialData = null) => {
        const draft = initialData ? { ...LINEAGE_TEMPLATE, ...initialData, id: initialData.id || `lineage_${uuidv4()}` } : { ...LINEAGE_TEMPLATE, id: `lineage_${uuidv4()}` };
        set({ isWizardOpen: true, wizardDraft: draft });
      },

      closeWizard: () => {
        set({ isWizardOpen: false, wizardDraft: null });
      },

      setWizardDraft: (updates) => {
        set((state) => ({
          wizardDraft: state.wizardDraft ? { ...state.wizardDraft, ...updates } : null
        }));
      },

      saveLineage: (lineageData) => {
        const now = new Date().toISOString();
        const finalData = {
          ...LINEAGE_TEMPLATE,
          ...lineageData,
          id: lineageData.id || `lineage_${uuidv4()}`,
          updatedAt: now,
          createdAt: lineageData.createdAt || now,
          isCustom: true
        };

        set((state) => {
          const exists = state.lineages.some((l) => l.id === finalData.id);
          const nextLineages = exists
            ? state.lineages.map((l) => (l.id === finalData.id ? finalData : l))
            : [finalData, ...state.lineages];

          return { lineages: nextLineages, isWizardOpen: false, wizardDraft: null, selectedLineageId: finalData.id };
        });

        triggerLineageAutoSync();
        return finalData;
      },

      deleteLineage: (id) => {
        set((state) => {
          const nextLineages = state.lineages.filter((l) => l.id !== id);
          return {
            lineages: nextLineages,
            selectedLineageId: state.selectedLineageId === id ? null : state.selectedLineageId
          };
        });
        triggerLineageAutoSync();
      },

      getLineage: (id) => {
        return get().lineages.find((l) => l.id === id) || null;
      },

      getAllLineages: () => {
        return get().lineages;
      },

      getPlayableLineages: () => {
        return get().lineages.map((l) => ({
          ...l,
          // Map to standard Character Wizard format
          cardFlavor: l.cardFlavor || l.essence,
          subraces: (l.subraces || []).reduce((acc, sub) => {
            acc[sub.id || sub.name.toLowerCase().replace(/\s+/g, '_')] = sub;
            return acc;
          }, {})
        }));
      },

      exportLineageJson: (id) => {
        const lineage = get().getLineage(id);
        if (!lineage) return null;
        return JSON.stringify(lineage, null, 2);
      },

      importLineageJson: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (!parsed.name) throw new Error('Invalid lineage data: missing name');
          return get().saveLineage({ ...parsed, id: `lineage_${uuidv4()}` });
        } catch (err) {
          console.error('Failed to import lineage JSON:', err);
          return null;
        }
      },

      // --- Cloud Synchronization & Hydration ---
      syncToCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'lineages');
          await setDoc(docRef, {
            lineages: get().lineages,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          set({ lastCloudSyncAt: new Date().toISOString() });
          return true;
        } catch (err) {
          console.debug('Lineages cloud sync skipped/failed:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'lineages');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data?.lineages) && data.lineages.length > 0) {
              set({ lineages: data.lineages });
              return true;
            } else if (get().lineages.length > 0) {
              await get().syncToCloud(userId);
              return true;
            }
          } else if (get().lineages.length > 0) {
            await get().syncToCloud(userId);
            return true;
          }
        } catch (err) {
          console.debug('Lineages cloud hydration skipped/failed:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig(STORAGE_KEY, {
      partialize: (state) => ({
        lineages: state.lineages,
        selectedLineageId: state.selectedLineageId,
        lastCloudSyncAt: state.lastCloudSyncAt
      })
    })
  )
);

export default useCustomLineageStore;
