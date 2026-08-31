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

// Inspiration presets — quick-start templates for the lineage wizard
export const PRESET_LINEAGES = [
  {
    id: 'preset_frost_touched_warden',
    name: 'Frost-Touched Warden',
    essence: 'The Rime-Bound',
    cardFlavor: 'Born under the first hard frost after the Freeze, veins faintly luminous with rime.',
    visualDescription: 'Pale, almost translucent skin threaded with ice-blue veins; breath mists even in warmth; eyes like glacial glass.',
    description: 'Descendants of vault-keepers who survived a season locked in the deep holds. The rime never left their blood.',
    culturalBackground: 'Stoic, oath-bound wardens who measure worth in winters endured. Settlements prize them as pathfinders through whiteout.',
    relationToSunDeath: 'They believe the sun withdrew to test endurance, and rime-blood is the mark of those judged worthy to keep watch until it returns.',
    originRegionId: 'frostwood-reach',
    baseTraits: { size: 'Medium', sizeCategory: 'Medium', baseSpeed: 30, baseHp: 28, baseMana: 10, baseAp: 3, lifespan: '90-140 years', languages: ['Common', 'Rimespeak'], height: "5'6\" - 6'4\"", weight: '150-230 lbs', build: 'Broad and frost-hardened' },
    abilityModifiers: { STR: 1, AGI: 0, CON: 1, INT: 0, SPI: 1, CHA: -1 },
    racialPassives: [{ id: 'preset_passive_frost', name: 'Rime-Blood', description: 'Resistance to cold and blizzard whiteout; +1 to saves vs. Rime and exposure.' }],
    racialAbilities: [{ id: 'preset_action_frost', name: 'Hoarfrost Step', actionPointCost: 2, manaCost: 5, school: 'Rime', cooldownType: 'encounter', damage: '', range: 'Self (15 ft aura)', description: 'Flash-freeze the ground at your feet: difficult terrain for foes, sure footing for allies, 1 round.' }],
    meaningfulTradeoffs: 'Vulnerable to Ember and radiant heat — disadvantage on saves vs. fire/heat while rime-blood is active.',
    subraces: [{ id: 'frost_holdborn', name: 'Hold-Born', description: 'Raised in the deep mountain holds; knows the vault ways.', perks: ['Darkvision 30 ft', '+1 CON vs. cold'] }],
    isCustom: true
  },
  {
    id: 'preset_emberveil_scions',
    name: 'Emberveil Scions',
    essence: 'The Ashen Veil',
    cardFlavor: 'Soot-kissed skin and ember eyes — children of the geothermal vents where the houses once bargained with fire.',
    visualDescription: 'Warm umber skin with faint ember flecks at the temples; hair like cooling cinder; eyes catch light like cooling iron.',
    description: 'Bloodlines that dwelt beside the Sundered Monolith vents. Ash and heat are home, not hazard.',
    culturalBackground: 'Smiths, fire-tenders, and oath-bound balancers who believe fire must be tended, never worshipped.',
    relationToSunDeath: 'They hold the sun did not die but sank into the earth, and their veins carry its last embers back toward the sky.',
    originRegionId: 'sundale',
    baseTraits: { size: 'Medium', sizeCategory: 'Medium', baseSpeed: 30, baseHp: 24, baseMana: 18, baseAp: 3, lifespan: '80-130 years', languages: ['Common', 'Emberspeak'], height: "5'4\" - 6'1\"", weight: '130-210 lbs', build: 'Lean and heat-tempered' },
    abilityModifiers: { STR: 0, AGI: 1, CON: 0, INT: 1, SPI: 0, CHA: 1 },
    racialPassives: [{ id: 'preset_passive_ember', name: 'Ashen Veil', description: 'Advantage on saves vs. smoke, ash, and non-magical heat; can see through light ash haze.' }],
    racialAbilities: [{ id: 'preset_action_ember', name: 'Cinder Veil', actionPointCost: 2, manaCost: 8, school: 'Ember', cooldownType: 'encounter', damage: '', range: 'Self', description: 'Shroud in cinder haze: lightly obscured, resistance to ranged attacks until your next turn.' }],
    meaningfulTradeoffs: 'Rime and cold bite deeper — vulnerability to Rime strain and whiteout exposure.',
    subraces: [{ id: 'ember_ventborn', name: 'Vent-Born', description: 'Born beside the monolith vents; attuned to geothermal whisper.', perks: ['Heat tolerance', '+1 INT (fire lore)'] }],
    isCustom: true
  },
  {
    id: 'preset_storm_sworn',
    name: 'Storm-Sworn Myrmidon',
    essence: 'The Gale-Riven',
    cardFlavor: 'Wind has carved their oaths into their bones. They hear the storm as a chorus, not a roar.',
    visualDescription: 'Weathered skin, storm-grey eyes, hair that never quite settles; faint static lifts fine hairs at the crown when anger rises.',
    description: 'A coastal and high-crag lineage that learned to read the Iceheart gales as language and survived by answering.',
    culturalBackground: 'Myrmidons, signal-runners, and sky-watchers. They swear by the storm, not by crowns, and keep oaths even when crowns forget.',
    relationToSunDeath: 'They believe Sol was torn apart by a wind too vast to name, and every gale still carries a fragment of its last word.',
    originRegionId: 'iceheart-sea',
    baseTraits: { size: 'Medium', sizeCategory: 'Medium', baseSpeed: 32, baseHp: 26, baseMana: 12, baseAp: 3, lifespan: '70-110 years', languages: ['Common', 'Stormcant'], height: "5'7\" - 6'3\"", weight: '145-225 lbs', build: 'Wiry and wind-cut' },
    abilityModifiers: { STR: 1, AGI: 1, CON: 0, INT: 0, SPI: 0, CHA: 0 },
    racialPassives: [{ id: 'preset_passive_storm', name: 'Gale-Riven Senses', description: 'Advantage on Perception checks in wind, rain, or storm; +5 ft speed in open terrain.' }],
    racialAbilities: [{ id: 'preset_action_storm', name: 'Windcutter Sprint', actionPointCost: 1, manaCost: 0, school: 'Tempest', cooldownType: 'encounter', damage: '', range: 'Self', description: 'Dash 15 ft without provoking opportunity; ignore difficult terrain from wind/ice this move.' }],
    meaningfulTradeoffs: 'Lightning finds them eagerly — disadvantage on saves vs. lightning and thunder while storm-charged.',
    subraces: [{ id: 'storm_crag', name: 'Crag-Runner', description: 'High-crag runners who map passes by wind-taste.', perks: ['Sure-footed on ice', '+5 ft climb speed'] }],
    isCustom: true
  }
];

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
