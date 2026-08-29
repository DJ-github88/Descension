/**
 * Talent Tree Data Structure
 * 
 * Defines talent trees for all classes with WoW-inspired layout
 * Each talent has flexible positioning and can have multiple prerequisites
 */

// Talent positioning uses a coordinate system where:
// - x: horizontal position (0-3, representing columns)
// - y: vertical position (0-6, representing tiers/rows)
// - Arrows are automatically drawn between talents and their prerequisites

/**
 * Talent Node Structure:
 * {
 *   id: string - unique identifier
 *   name: string - display name
 *   description: string - tooltip description
 *   icon: string - WoW icon name
 *   maxRanks: number - how many points can be invested
 *   position: { x: number, y: number } - grid position
 *   requires: string | string[] - prerequisite talent ID(s)
 *   requiresPoints: number - minimum points in tree to unlock
 *   requiresAll: boolean - if true, ALL prerequisites must be met (AND logic)
 * }
 */

import {
  TOXICOLOGIST_VENOMANCER,
  TOXICOLOGIST_GADGETEER,
  TOXICOLOGIST_SABOTEUR
} from './talentTrees/toxicologist.js';

import {
  PYROFIEND_INFERNO,
  PYROFIEND_WILDFIRE,
  PYROFIEND_HELLFIRE
} from './talentTrees/pyrofiend.js';

import {
  MINSTREL_HARMONIC_WEAVING,
  MINSTREL_CHORD_COMBINATIONS,
  MINSTREL_MUSICAL_MAGIC
} from './talentTrees/minstrel.js';

import {
  CHRONARCH_STASIS_TREE,
  CHRONARCH_DISPLACEMENT_TREE,
  CHRONARCH_REWINDING_TREE
} from './talentTrees/chronarch.js';

import {
  HARBINGER_WILD_PROPHET,
  HARBINGER_DEATHS_SEER,
  HARBINGER_FATE_RIFT
} from './talentTrees/harbinger.js';

import {
  GAMBIT_PROBABILITY_SAVANT,
  GAMBIT_HIGH_ROLLER,
  GAMBIT_KARMIC_WEAVER
} from './talentTrees/gambit.js';

import {
  MARTYR_REDEMPTION,
  MARTYR_ZEALOT,
  MARTYR_ASCETIC,
  MARTYR_IRONCLAD
} from './talentTrees/martyr.js';

import {
  FALSE_PROPHET_SILENCE_SPEAKER,
  FALSE_PROPHET_DECEIVER,
  FALSE_PROPHET_CULTIST
} from './talentTrees/falseprophet.js';

// Inquisitor - Merged Covenbane + Exorcist
import {
  INQUISITOR_WITCH_HAMMER,
  INQUISITOR_IRON_VERDICT,
  INQUISITOR_HOLLOW_SAINT
} from './talentTrees/inquisitor.js';

import {
  PLAGUEBRINGER_VIRULENT_SPREADER,
  PLAGUEBRINGER_TORMENT_WEAVER,
  PLAGUEBRINGER_DECAY_HARBINGER
} from './talentTrees/plaguebringer.js';

// 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
import {
  REVENANT_SANGUINE_HARVEST,
  REVENANT_FROST_SOVEREIGN,
  REVENANT_PHYLACTERY_ANCHOR
} from './talentTrees/revenant.js';

import {
  SPELLGUARD_ARCANE_WARDEN,
  SPELLGUARD_SPELL_BREAKER,
  SPELLGUARD_MANA_REAVER
} from './talentTrees/spellguard.js';

import {
  ANIMIST_THORNWARDEN,
  ANIMIST_SPIRIT_BINDER,
  ANIMIST_STORMSCRIBE
} from './talentTrees/animist.js';

import {
  ARCANONEER_PRISM_MAGE,
  ARCANONEER_ENTROPY_WEAVER,
  ARCANONEER_SPHERE_ARCHITECT
} from './talentTrees/arcanoneer.js';

import {
  BERSERKER_SAVAGE,
  BERSERKER_JUGGERNAUT,
  BERSERKER_WARLORD,
  BERSERKER_PRIMAL_RAGE,
  BERSERKER_BLOOD_FRENZY,
  BERSERKER_SAVAGE_INSTINCTS
} from './talentTrees/berserker.js';

import {
  AUGUR_AUSPICE,
  AUGUR_HARBINGER,
  AUGUR_HIEROPHANT
} from './talentTrees/augur.js';

import {
  SHAPER_FLOW_MASTER,
  SHAPER_IRON_DANCER,
  SHAPER_PRIMAL_SHADOW
} from './talentTrees/shaper.js';

import {
  LUNARCH_HOLLOW_SENTINEL,
  LUNARCH_SILENCE_SPEAKER,
  LUNARCH_SANGUINE_WARDEN,
  LUNARCH_MOONLIGHT_SENTINEL,
  LUNARCH_STARFALL_INVOKER,
  LUNARCH_MOONWELL_GUARDIAN
} from './talentTrees/lunarch.js';

import {
  APEX_SHADOWBLADE,
  APEX_BLADESTORM,
  APEX_BEASTMASTER
} from './talentTrees/apex.js';

import {
  WARDEN_SHADOWBLADE,
  WARDEN_VENGEANCE_SEEKER,
  WARDEN_MONOLITH
} from './talentTrees/warden.js';

import {
  CRUSADER_SOLAR_JUSTICIAR,
  CRUSADER_DAWN_BASTION,
  CRUSADER_HARMONIC_INQUISITOR
} from './talentTrees/crusader.js';

export const getTreeBackdrop = (className, specId) => {
  // Map class and specialization to high-res thematic background images from /assets/Backgrounds/
  const backdropMap = {
    'Pyrofiend': {
      'inferno': 'url(/assets/Backgrounds/Volcano.png)',
      'wildfire': 'url(/assets/Backgrounds/Embers.png)',
      'apostate': 'url(/assets/Backgrounds/Volcano%20Lake.png)'
    },
    'Minstrel': {
      'soulsinger': 'url(/assets/Backgrounds/Flowers.png)',
      'battlechoir': 'url(/assets/Backgrounds/Forest1.png)',
      'dissonance': 'url(/assets/Backgrounds/OpenForest.png)',
      'harmonic_weaving': 'url(/assets/Backgrounds/Flowers.png)',
      'chord_combinations': 'url(/assets/Backgrounds/Forest1.png)',
      'musical_magic': 'url(/assets/Backgrounds/OpenForest.png)'
    },
    'Chronarch': {
      'stasis': 'url(/assets/Backgrounds/Frost.png)',
      'displacement': 'url(/assets/Backgrounds/HazyCave.png)',
      'rewinding': 'url(/assets/Backgrounds/NightFrost.png)'
    },
    'Toxicologist': {
      'venomancer': 'url(/assets/Backgrounds/GloomyCave.png)',
      'gadgeteer': 'url(/assets/Backgrounds/Smoke.png)',
      'saboteur': 'url(/assets/Backgrounds/Spikey%20Cave.png)'
    },
    'Harbinger': {
      'wild_prophet': 'url(/assets/Backgrounds/DenseForest.png)',
      'deaths_seer': 'url(/assets/Backgrounds/NightFrost.png)',
      'fate_rift': 'url(/assets/Backgrounds/CrystalCave.png)'
    },
    'Arcanoneer': {
      'prism_mage': 'url(/assets/Backgrounds/MountainSky.png)',
      'entropy_weaver': 'url(/assets/Backgrounds/Smoke.png)',
      'sphere_architect': 'url(/assets/Backgrounds/Sky.png)',
      'sphere_master': 'url(/assets/Backgrounds/Sky.png)'
    },
    'Animist': {
      'thornwarden': 'url(/assets/Backgrounds/DenseForest.png)',
      'spirit_binder': 'url(/assets/Backgrounds/Flowers.png)',
      'stormscribe': 'url(/assets/Backgrounds/Forest4.png)',
      'wild_guardian': 'url(/assets/Backgrounds/DenseForest.png)',
      'spirit_caller': 'url(/assets/Backgrounds/Flowers.png)',
      'swarm_keeper': 'url(/assets/Backgrounds/Forest4.png)'
    },
    'Inquisitor': {
      'witch_hammer': 'url(/assets/Backgrounds/CrystalCave.png)',
      'iron_verdict': 'url(/assets/Backgrounds/DesertTemple.png)',
      'hollow_saint': 'url(/assets/Backgrounds/Temple.png)'
    },
    'Lunarch': {
      'hollow-sentinel': 'url(/assets/Backgrounds/NightFrost.png)',
      'silence-speaker': 'url(/assets/Backgrounds/MountainSky.png)',
      'sanguine-warden': 'url(/assets/Backgrounds/FrozTemple.png)',
      'moonlight-sentinel': 'url(/assets/Backgrounds/NightFrost.png)',
      'starfall-invoker': 'url(/assets/Backgrounds/MountainSky.png)',
      'moonwell-guardian': 'url(/assets/Backgrounds/FrozTemple.png)'
    },
    'Apex': {
      'shadowblade': 'url(/assets/Backgrounds/Forest3.png)',
      'bladestorm': 'url(/assets/Backgrounds/DenseForest.png)',
      'beastmaster': 'url(/assets/Backgrounds/mountains4.png)'
    },
    'Warden': {
      'shadowblade': 'url(/assets/Backgrounds/Forest2.png)',
      'vengeance-seeker': 'url(/assets/Backgrounds/mountains3.png)',
      'monolith': 'url(/assets/Backgrounds/mountains1.png)'
    },
    'Gambit': {
      'probability_savant': 'url(/assets/Backgrounds/Stonehedge.png)',
      'high_roller': 'url(/assets/Backgrounds/Smoke.png)',
      'karmic_weaver': 'url(/assets/Backgrounds/CrystalCave.png)'
    },
    'Martyr': {
      'redemption': 'url(/assets/Backgrounds/Temple.png)',
      'zealot': 'url(/assets/Backgrounds/DesertTemple.png)',
      'ascetic': 'url(/assets/Backgrounds/Stonehedge.png)',
      'ironclad': 'url(/assets/Backgrounds/Volcano.png)'
    },
    'False Prophet': {
      'silence_speaker': 'url(/assets/Backgrounds/DesertTemple.png)',
      'deceiver': 'url(/assets/Backgrounds/HazyCave.png)',
      'cultist': 'url(/assets/Backgrounds/Stonehedge.png)'
    },
    'Plaguebringer': {
      'virulent_spreader': 'url(/assets/Backgrounds/GloomyCave.png)',
      'torment_weaver': 'url(/assets/Backgrounds/Spikey%20Cave.png)',
      'decay_harbinger': 'url(/assets/Backgrounds/HazyCave.png)',
      'virulent': 'url(/assets/Backgrounds/GloomyCave.png)',
      'torment': 'url(/assets/Backgrounds/Spikey%20Cave.png)',
      'decay': 'url(/assets/Backgrounds/HazyCave.png)'
    },
    'Revenant': {
      'sanguine_harvest': 'url(/assets/Backgrounds/Volcano%20Lake.png)',
      'frost_sovereign': 'url(/assets/Backgrounds/Frost.png)',
      'phylactery_anchor': 'url(/assets/Backgrounds/CrystalCave.png)'
    },
    'Spellguard': {
      'arcane_warden': 'url(/assets/Backgrounds/CrystalCave.png)',
      'spell_breaker': 'url(/assets/Backgrounds/DesertTemple.png)',
      'mana_reaver': 'url(/assets/Backgrounds/Temple.png)'
    },
    'Berserker': {
      'savage': 'url(/assets/Backgrounds/Volcano.png)',
      'juggernaut': 'url(/assets/Backgrounds/mountains2.png)',
      'warlord': 'url(/assets/Backgrounds/Forest1.png)',
      'primal_rage': 'url(/assets/Backgrounds/Volcano.png)',
      'blood_frenzy': 'url(/assets/Backgrounds/mountains2.png)',
      'savage_instincts': 'url(/assets/Backgrounds/Forest1.png)'
    },
    'Augur': {
      'auspex': 'url(/assets/Backgrounds/NightFrost.png)',
      'harbinger': 'url(/assets/Backgrounds/Stonehedge.png)',
      'hierophant': 'url(/assets/Backgrounds/DesertTemple.png)'
    },
    'Crusader': {
      'solar_justiciar': 'url(/assets/Backgrounds/DesertTemple.png)',
      'dawn_bastion': 'url(/assets/Backgrounds/Temple.png)',
      'harmonic_inquisitor': 'url(/assets/Backgrounds/MountainSky.png)'
    }
  };

  if (!className) return null;
  const direct = backdropMap[className]?.[specId];
  if (direct) return direct;
  const normalized = className.toLowerCase().replace(/[-_]/g, ' ');
  const entry = Object.entries(backdropMap).find(([key]) =>
    key.toLowerCase() === normalized || key.toLowerCase().replace(/[-_]/g, ' ') === normalized
  );
  return entry?.[1]?.[specId] || null;
};

// Fallback thematic backgrounds from the Backgrounds array for each tree index
export const getFallbackBackground = (treeIndex) => {
  const backgrounds = [
    'url(/assets/Backgrounds/Stonehedge.png)',
    'url(/assets/Backgrounds/CrystalCave.png)',
    'url(/assets/Backgrounds/Smoke.png)',
    'url(/assets/Backgrounds/MountainSky.png)',
    'url(/assets/Backgrounds/DesertTemple.png)',
    'url(/assets/Backgrounds/Forest1.png)',
    'url(/assets/Backgrounds/Volcano.png)'
  ];
  return backgrounds[treeIndex % backgrounds.length];
};

export const TALENT_TREES = {
  'Toxicologist': {
    'venomancer': TOXICOLOGIST_VENOMANCER,
    'gadgeteer': TOXICOLOGIST_GADGETEER,
    'saboteur': TOXICOLOGIST_SABOTEUR
  },
  'Pyrofiend': {
    'inferno': PYROFIEND_INFERNO,
    'wildfire': PYROFIEND_WILDFIRE,
    'apostate': PYROFIEND_HELLFIRE
  },
  'Minstrel': {
    'soulsinger': MINSTREL_HARMONIC_WEAVING,
    'battlechoir': MINSTREL_CHORD_COMBINATIONS,
    'dissonance': MINSTREL_MUSICAL_MAGIC
  },
  'Chronarch': {
    'stasis': CHRONARCH_STASIS_TREE,
    'displacement': CHRONARCH_DISPLACEMENT_TREE,
    'rewinding': CHRONARCH_REWINDING_TREE
  },
  'Harbinger': {
    'wild_prophet': HARBINGER_WILD_PROPHET,
    'deaths_seer': HARBINGER_DEATHS_SEER,
    'fate_rift': HARBINGER_FATE_RIFT
  },
  'Gambit': {
    'probability_savant': GAMBIT_PROBABILITY_SAVANT,
    'high_roller': GAMBIT_HIGH_ROLLER,
    'karmic_weaver': GAMBIT_KARMIC_WEAVER
  },
  'Martyr': {
    'redemption': MARTYR_REDEMPTION,
    'zealot': MARTYR_ZEALOT,
    'ascetic': MARTYR_ASCETIC,
    'ironclad': MARTYR_IRONCLAD
  },
  'False Prophet': {
    'silence_speaker': FALSE_PROPHET_SILENCE_SPEAKER,
    'deceiver': FALSE_PROPHET_DECEIVER,
    'cultist': FALSE_PROPHET_CULTIST
  },
  'Plaguebringer': {
    'virulent_spreader': PLAGUEBRINGER_VIRULENT_SPREADER,
    'torment_weaver': PLAGUEBRINGER_TORMENT_WEAVER,
    'decay_harbinger': PLAGUEBRINGER_DECAY_HARBINGER
  },
  'Revenant': {
    'sanguine_harvest': REVENANT_SANGUINE_HARVEST,
    'frost_soVEREIGN': REVENANT_FROST_SOVEREIGN,
    'frost_sovereign': REVENANT_FROST_SOVEREIGN,
    'phylactery_anchor': REVENANT_PHYLACTERY_ANCHOR
  },
  'Spellguard': {
    'arcane_warden': SPELLGUARD_ARCANE_WARDEN,
    'spell_breaker': SPELLGUARD_SPELL_BREAKER,
    'mana_reaver': SPELLGUARD_MANA_REAVER
  },
  'Animist': {
    'thornwarden': ANIMIST_THORNWARDEN,
    'spirit_binder': ANIMIST_SPIRIT_BINDER,
    'stormscribe': ANIMIST_STORMSCRIBE
  },
  'Arcanoneer': {
    'prism_mage': ARCANONEER_PRISM_MAGE,
    'entropy_weaver': ARCANONEER_ENTROPY_WEAVER,
    'sphere_architect': ARCANONEER_SPHERE_ARCHITECT
  },
  'Shaper': {
    'flow-master': SHAPER_FLOW_MASTER,
    'iron-dancer': SHAPER_IRON_DANCER,
    'primal-shadow': SHAPER_PRIMAL_SHADOW
  },
  'Inquisitor': {
    'witch_hammer': INQUISITOR_WITCH_HAMMER,
    'iron_verdict': INQUISITOR_IRON_VERDICT,
    'hollow_saint': INQUISITOR_HOLLOW_SAINT
  },
  'Lunarch': {
    'hollow-sentinel': LUNARCH_HOLLOW_SENTINEL,
    'silence-speaker': LUNARCH_SILENCE_SPEAKER,
    'sanguine-warden': LUNARCH_SANGUINE_WARDEN,
    // Legacy aliases
    'moonlight-sentinel': LUNARCH_HOLLOW_SENTINEL,
    'starfall-invoker': LUNARCH_SILENCE_SPEAKER,
    'moonwell-guardian': LUNARCH_SANGUINE_WARDEN
  },
  'Apex': {
    'shadowblade': APEX_SHADOWBLADE,
    'bladestorm': APEX_BLADESTORM,
    'beastmaster': APEX_BEASTMASTER
  },
  'Warden': {
    'shadowblade': WARDEN_SHADOWBLADE,
    'vengeance-seeker': WARDEN_VENGEANCE_SEEKER,
    'monolith': WARDEN_MONOLITH
  },
  'Berserker': {
    'savage': BERSERKER_SAVAGE,
    'juggernaut': BERSERKER_JUGGERNAUT,
    'warlord': BERSERKER_WARLORD,
    // Legacy aliases
    'primal_rage': BERSERKER_SAVAGE,
    'blood_frenzy': BERSERKER_WARLORD,
    'savage_instincts': BERSERKER_JUGGERNAUT
  },
  'Augur': {
    'auspex': AUGUR_AUSPICE,
    'harbinger': AUGUR_HARBINGER,
    'hierophant': AUGUR_HIEROPHANT
  },
  'Crusader': {
    'solar_justiciar': CRUSADER_SOLAR_JUSTICIAR,
    'dawn_bastion': CRUSADER_DAWN_BASTION,
    'harmonic_inquisitor': CRUSADER_HARMONIC_INQUISITOR
  }
};

// Helper function to get talents for a specific class and specialization
export const getTalentsForSpec = (className, specId) => {
  if (!className) return PLACEHOLDER_TREE;
  const direct = TALENT_TREES[className]?.[specId];
  if (direct) return direct;
  const normalized = className.toLowerCase().replace(/[-_]/g, ' ');
  const entry = Object.entries(TALENT_TREES).find(([key]) =>
    key.toLowerCase() === normalized || key.toLowerCase().replace(/[-_]/g, ' ') === normalized
  );
  return entry?.[1]?.[specId] || PLACEHOLDER_TREE;
};

// Placeholder talent tree for missing or invalid specs
export const PLACEHOLDER_TREE = [
  {
    id: 'placeholder_t0',
    name: 'Coming Soon',
    description: 'This talent tree is under development.',
    icon: 'inv_misc_questionmark',
    maxRanks: 1,
    position: { x: 1.5, y: 1 },
    requires: null,
  },
  {
    id: 'placeholder_t1',
    name: 'Coming Soon',
    description: 'This talent tree is under development.',
    icon: 'inv_misc_questionmark',
    maxRanks: 1,
    position: { x: 1.5, y: 3 },
    requires: null,
  }
];
