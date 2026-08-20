import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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

const loadStoredLineages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(p => !p.isPreset) : [];
  } catch (e) {
    console.error('Error loading custom lineages:', e);
    return [];
  }
};

const saveStoredLineages = (lineages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineages));
  } catch (e) {
    console.error('Error saving custom lineages:', e);
  }
};

const useCustomLineageStore = create((set, get) => ({
  lineages: loadStoredLineages(),
  selectedLineageId: null,
  isWizardOpen: false,
  wizardDraft: null,

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

      saveStoredLineages(nextLineages);
      return { lineages: nextLineages, isWizardOpen: false, wizardDraft: null, selectedLineageId: finalData.id };
    });

    return finalData;
  },

  deleteLineage: (id) => {
    set((state) => {
      const nextLineages = state.lineages.filter((l) => l.id !== id);
      saveStoredLineages(nextLineages);
      return {
        lineages: nextLineages,
        selectedLineageId: state.selectedLineageId === id ? null : state.selectedLineageId
      };
    });
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
  }
}));

export default useCustomLineageStore;
