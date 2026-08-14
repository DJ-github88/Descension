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

// Inspiring default preset to ignite the user's creativity
export const PRESET_LINEAGES = [
  {
    id: 'preset_pyre_dwarf',
    name: 'Pyre-Dwarf',
    essence: 'The Magma-Forged',
    illustration: '/assets/images/races/solari_illustration.png',
    illustrationCaption: 'A stone-skinned Pyre-Dwarf forge-guard wielding a basalt maul heated by internal ember veins.',
    cardFlavor: 'Subterranean stone-shapers who bound themselves to the magma conduits of Sundale after Sol was entombed.',
    visualDescription: 'Stocky, broad-shouldered humanoids standing 4\'2" to 4\'10" with dark basalt-grey skin. Faint orange veins pulse beneath the surface of their skin, growing hotter and brighter during combat or exertion. Their hair resembles spun volcanic glass or dark soot.',
    description: '**[The Magma-Forged of Sundale]**, *When the star Sol was entombed beneath Emberspire, a sect of deep-shaft miners refused to flee to the frozen surface. They carved deep stone halls directly into the magma conduits, trading their mortality for the heat of the dying sun.*\n\nEight centuries later, the Pyre-Dwarves remain the undisputed masters of thermal alchemy, basalt architecture, and rimesteel refinement. They regard surface-dwellers with solemn pity, viewing the frozen world above as a cemetery of dying fires.',
    culturalBackground: 'Pyre-Dwarf society is organized around the Great Hearths—vast subterranean smelters that serve as temple, government, and communal home. Every Pyre-Dwarf child is given an uncarved shard of obsidian upon birth, which they slowly sculpt with their own heated blood throughout their lifetime to record their name, oaths, and ancestral deeds.',
    relationToSunDeath: 'While the Six Houses capitulated to Keth-Amar and traded their children for regional bargains, the ancestors of the Pyre-Dwarves struck no bargain with the Sun-Eater. Instead, they tapped directly into the molten crust surrounding Sol\'s volcanic vault.',
    originRegionId: 'sundale',
    affiliatedFactionIds: ['house-solvan'],
    baseTraits: {
      size: 'Medium',
      sizeCategory: 'Medium',
      baseSpeed: 25,
      baseHp: 30,
      baseMana: 10,
      baseAp: 3,
      lifespan: '180-260 years',
      languages: ['Common', 'Ignan', 'Deep-Speech'],
      height: "4'2\" - 4'10\"",
      weight: '160-250 lbs',
      build: 'Dense, muscular, low center of gravity'
    },
    abilityModifiers: {
      STR: 2,
      AGI: -1,
      CON: 2,
      INT: 0,
      SPI: 1,
      CHA: -1
    },
    racialPassives: [
      {
        id: 'ember_veins',
        name: 'Ember Veins',
        description: 'Gain Resistance (25%) to Ember damage. When struck in melee, attackers take 1d4 Ember retaliation damage.'
      }
    ],
    racialAbilities: [
      {
        id: 'magma_exhalation',
        name: 'Magma Exhalation',
        actionPointCost: 2,
        manaCost: 4,
        school: 'Ember',
        cooldownType: 'encounter',
        damage: '2d6 Ember',
        range: '15ft Cone',
        description: 'Exhale a blast of superheated ash and molten stone in a 15ft cone. Enemies failing an Agility save are Blinded for 1 round.'
      }
    ],
    meaningfulTradeoffs: 'Thermal Vulnerability: Suffers Vulnerability (+25%) to Rime damage. In freezing climates without an active heat source, movement speed is reduced by 5ft.',
    subraces: [
      {
        id: 'cinder_forged',
        name: 'Cinder-Forged',
        description: 'Garrison defenders who have grafted tempered rimesteel plates directly over their stone skin.',
        perks: ['+5 Base HP', 'Proficiency with Heavy Armor & Forging Hammers']
      },
      {
        id: 'ash_stalker',
        name: 'Ash-Stalker',
        description: 'Scouts who navigate volcanic vents and sulfur tunnels unseen.',
        perks: ['Immunity to Choking & Smoke', '+2 Stealth in darkness or smoke']
      }
    ],
    isCustom: true,
    isPreset: true,
    createdAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'preset_rime_corvani',
    name: 'Rime-Corvani',
    essence: 'The Chill-Winged',
    illustration: '/assets/images/races/astril_illustration.png',
    illustrationCaption: 'A Rime-Corvani scout perched atop an ironwood spire in Nordhalla, feathers glistening with rime.',
    cardFlavor: 'Raven-folk adapted to the biting whiteouts of Nordhalla, carrying messages across frozen fjords where no horse can ride.',
    visualDescription: 'Avian humanoids standing 5\'0" to 5\'8", clad in iridescent blue-black plumage that naturally repels rime and frost. Their fingers end in sharp obsidian talons capable of gripping frozen rock faces.',
    description: '**[Messengers of the Eternal Freeze]**, *The Rime-Corvani are nomadic avian observers who negotiated roosting rights along Nordhalla\'s Sunder-Wall. Their keen eyes pierce blizzards that blind ordinary mortals.*',
    culturalBackground: 'Corvani trade secrets and historical scrolls rather than gold. An oath sworn upon a Corvani quill is considered legally binding across all northern jarls.',
    relationToSunDeath: 'When the Glacier Bargain stopped the ice from moving, the Corvani learned to read the shifting hum of the ice to predict crevasses and avalanches.',
    originRegionId: 'nordhalla',
    affiliatedFactionIds: ['house-skalvyr'],
    baseTraits: {
      size: 'Medium',
      sizeCategory: 'Medium',
      baseSpeed: 30,
      baseHp: 22,
      baseMana: 18,
      baseAp: 3,
      lifespan: '70-110 years',
      languages: ['Common', 'Corvidspeak', 'Skaldic'],
      height: "5'0\" - 5'8\"",
      weight: '100-150 lbs',
      build: 'Light, nimble, hollow-boned'
    },
    abilityModifiers: {
      STR: -1,
      AGI: 2,
      CON: 0,
      INT: 2,
      SPI: 1,
      CHA: 0
    },
    racialPassives: [
      {
        id: 'gale_glider',
        name: 'Gale Glider',
        description: 'Immunity to fall damage from heights under 60ft. Advantage on checks to navigate blizzards and mountain squalls.'
      }
    ],
    racialAbilities: [
      {
        id: 'rime_quill_flurry',
        name: 'Rime Quill Flurry',
        actionPointCost: 2,
        manaCost: 3,
        school: 'Rime',
        cooldownType: 'encounter',
        damage: '1d8 Physical + 1d6 Rime',
        range: '30ft',
        description: 'Launch a fan of razor-sharp rime-quills at up to two targets within range, slowing them by 10ft for 1 round.'
      }
    ],
    meaningfulTradeoffs: 'Fragile Skeletal Frame: Maximum HP is reduced by 10%. Suffers -2 on checks to resist physical grapples or shoves.',
    subraces: [
      {
        id: 'skaldic_roost',
        name: 'Skaldic Roost-Kin',
        description: 'Trained in the frozen archives of King-Jarl Halvar.',
        perks: ['+2 Mana', 'Proficiency in History & Arcana']
      }
    ],
    isCustom: true,
    isPreset: true,
    createdAt: '2026-08-14T00:00:00.000Z'
  }
];

const loadStoredLineages = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_LINEAGES));
      return PRESET_LINEAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRESET_LINEAGES;
  } catch (e) {
    console.error('Error loading custom lineages:', e);
    return PRESET_LINEAGES;
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
