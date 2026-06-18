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

// Helper function to create backdrop image URL for class/spec
/*
// Import the moved talent trees
// Temporarily commented out to resolve duplicate declarations
*/
// 'Dreadnaught' talent trees removed (absorbed into Martyr as Ironclad specialization)

// Titan talent trees removed (absorbed into Warden as Monolith specialization)

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
  MARTYR_ASCETIC
} from './talentTrees/martyr.js';

import {
  FALSE_PROPHET_VOIDCALLER,
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
  WARDEN_JAILER,
  WARDEN_VENGEANCE_SEEKER
} from './talentTrees/warden.js';
export const getTreeBackdrop = (className, specId) => {
  // Map class and specialization to backdrop images
  const backdropMap = {
    'Pyrofiend': {
      'inferno': 'url(/assets/backdrops/pyrofiend-inferno.jpg)',
      'wildfire': 'url(/assets/backdrops/pyrofiend-wildfire.jpg)',
      'hellfire': 'url(/assets/backdrops/pyrofiend-hellfire.jpg)'
    },
    'Minstrel': {
      'soulsinger': 'url(/assets/backdrops/minstrel-harmonic.jpg)',
      'battlechoir': 'url(/assets/backdrops/minstrel-chord.jpg)',
      'dissonance': 'url(/assets/backdrops/minstrel-musical.jpg)'
    },
    'Chronarch': {
      'stasis': 'url(/assets/backdrops/chronarch-stasis.jpg)',
      'displacement': 'url(/assets/backdrops/chronarch-displacement.jpg)',
      'rewinding': 'url(/assets/backdrops/chronarch-rewinding.jpg)'
    },
    // 'Dreadnaught' backdrops removed (absorbed into Martyr as Ironclad specialization)
    // 'Titan' backdrops removed (absorbed into Warden as Monolith specialization)
    'Toxicologist': {
      'venomancer': 'url(/assets/backdrops/toxicologist-venomancer.jpg)',
      'gadgeteer': 'url(/assets/backdrops/toxicologist-gadgeteer.jpg)',
      'saboteur': 'url(/assets/backdrops/toxicologist-saboteur.jpg)'
    },
    'Harbinger': {
      'wild_prophet': 'url(/assets/backdrops/harbinger-wild-prophet.jpg)',
      'deaths_seer': 'url(/assets/backdrops/harbinger-deaths-seer.jpg)',
      'fate_rift': 'url(/assets/backdrops/harbinger-fate-rift.jpg)'
    },
    'Arcanoneer': {
      'prism_mage': 'url(/assets/backdrops/arcanoneer-prism.jpg)',
      'entropy_weaver': 'url(/assets/backdrops/arcanoneer-entropy.jpg)',
      'sphere_architect': 'url(/assets/backdrops/arcanoneer-sphere.jpg)'
    },

    'Animist': {
      'thornwarden': 'url(/assets/backdrops/animist-thornwarden.jpg)',
      'spirit_binder': 'url(/assets/backdrops/animist-spirit-binder.jpg)',
      'stormscribe': 'url(/assets/backdrops/animist-stormscribe.jpg)'
    },
    'Inquisitor': {
      'witch_hammer': 'url(/assets/backdrops/inquisitor-witch-hammer.jpg)',
      'iron_verdict': 'url(/assets/backdrops/inquisitor-iron-verdict.jpg)',
      'hollow_saint': 'url(/assets/backdrops/inquisitor-hollow-saint.jpg)'
    },

    'Lunarch': {
      'moonlight-sentinel': 'url(/assets/backdrops/lunarch-moonlight-sentinel.jpg)',
      'starfall-invoker': 'url(/assets/backdrops/lunarch-starfall-invoker.jpg)',
      'moonwell-guardian': 'url(/assets/backdrops/lunarch-moonwell-guardian.jpg)'
    },
    'Apex': {
      'shadowblade': 'url(/assets/backdrops/apex-shadowblade.jpg)',
      'bladestorm': 'url(/assets/backdrops/apex-bladestorm.jpg)',
      'beastmaster': 'url(/assets/backdrops/apex-beastmaster.jpg)'
    },
    'Warden': {
      'shadowblade': 'url(/assets/backdrops/warden-shadowblade.jpg)',
      'jailer': 'url(/assets/backdrops/warden-jailer.jpg)',
      'avenger': 'url(/assets/backdrops/warden-avenger.jpg)'
    },
    'Gambit': {
      'probability_savant': 'url(/assets/backdrops/fate-fortune.jpg)',
      'high_roller': 'url(/assets/backdrops/gambler-risk.jpg)',
      'karmic_weaver': 'url(/assets/backdrops/fate-thread.jpg)'
    },
    'Martyr': {
      'redemption': 'url(/assets/backdrops/martyr-protector.jpg)',
      'zealot': 'url(/assets/backdrops/martyr-redeemer.jpg)',
      'ascetic': 'url(/assets/backdrops/martyr-avenger.jpg)'
    },
    'False Prophet': {
      'voidcaller': 'url(/assets/backdrops/falseprophet-voidcaller.jpg)',
      'deceiver': 'url(/assets/backdrops/falseprophet-deceiver.jpg)',
      'cultist': 'url(/assets/backdrops/falseprophet-cultist.jpg)'
    },
    'Plaguebringer': {
      'virulent_spreader': 'url(/assets/backdrops/plaguebringer-virulent.jpg)',
      'torment_weaver': 'url(/assets/backdrops/plaguebringer-torment.jpg)',
      'decay_harbinger': 'url(/assets/backdrops/plaguebringer-decay.jpg)'
    },
    // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
    'Revenant': {
      'sanguine_harvest': 'url(/assets/backdrops/deathcaller-blood.jpg)',
      'frost_sovereign': 'url(/assets/backdrops/lichborne-frostbound.jpg)',
      'phylactery_anchor': 'url(/assets/backdrops/lichborne-phylactery.jpg)'
    },
    'Spellguard': {
      'arcane_warden': 'url(/assets/backdrops/spellguard-warden.jpg)',
      'spell_breaker': 'url(/assets/backdrops/spellguard-breaker.jpg)',
      'mana_reaver': 'url(/assets/backdrops/spellguard-reaver.jpg)'
    },
    'Berserker': {
      'primal_rage': 'url(/assets/backdrops/berserker-primal-rage.jpg)',
      'blood_frenzy': 'url(/assets/backdrops/berserker-blood-frenzy.jpg)',
      'savage_instincts': 'url(/assets/backdrops/berserker-savage-instincts.jpg)'
    },
    'Augur': {
      'auspex': 'url(/assets/backdrops/augur-auspex.jpg)',
      'harbinger': 'url(/assets/backdrops/augur-harbinger.jpg)',
      'hierophant': 'url(/assets/backdrops/augur-hierophant.jpg)'
    },
    // Add more classes as needed
  };

  // Return backdrop or fallback gradient
  return backdropMap[className]?.[specId] || null;
};

// Fallback gradient backgrounds for each tree index
export const getFallbackBackground = (treeIndex) => {
  const backgrounds = [
    'linear-gradient(135deg, rgba(139, 69, 19, 0.15) 0%, rgba(101, 67, 33, 0.25) 50%, rgba(139, 69, 19, 0.15) 100%)',
    'linear-gradient(135deg, rgba(70, 130, 180, 0.15) 0%, rgba(100, 149, 237, 0.25) 50%, rgba(70, 130, 180, 0.15) 100%)',
    'linear-gradient(135deg, rgba(220, 20, 60, 0.15) 0%, rgba(178, 34, 34, 0.25) 50%, rgba(220, 20, 60, 0.15) 100%)'
  ];
  return backgrounds[treeIndex % 3];
};
export const TALENT_TREES = {
  // 'Dreadnaught' tree map removed (absorbed into Martyr as Ironclad specialization)
  // 'Titan' tree map removed (absorbed into Warden as Monolith specialization)
  'Toxicologist': {
    'venomancer': TOXICOLOGIST_VENOMANCER,
    'gadgeteer': TOXICOLOGIST_GADGETEER,
    'saboteur': TOXICOLOGIST_SABOTEUR
  },
  'Pyrofiend': {
    'inferno': PYROFIEND_INFERNO,
    'wildfire': PYROFIEND_WILDFIRE,
    'hellfire': PYROFIEND_HELLFIRE
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
    'ascetic': MARTYR_ASCETIC
  },
  'False Prophet': {
    'voidcaller': FALSE_PROPHET_VOIDCALLER,
    'deceiver': FALSE_PROPHET_DECEIVER,
    'cultist': FALSE_PROPHET_CULTIST
  },
  'Plaguebringer': {
    'virulent_spreader': PLAGUEBRINGER_VIRULENT_SPREADER,
    'torment_weaver': PLAGUEBRINGER_TORMENT_WEAVER,
    'decay_harbinger': PLAGUEBRINGER_DECAY_HARBINGER
  },
  // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
  'Revenant': {
    'sanguine_harvest': REVENANT_SANGUINE_HARVEST,
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
  // 'Bladedancer' and 'Formbender' merged into Shaper as Phase 1.8 consolidation
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
    'moonlight-sentinel': LUNARCH_MOONLIGHT_SENTINEL,
    'starfall-invoker': LUNARCH_STARFALL_INVOKER,
    'moonwell-guardian': LUNARCH_MOONWELL_GUARDIAN
  },
  'Apex': {
    'shadowblade': APEX_SHADOWBLADE,
    'bladestorm': APEX_BLADESTORM,
    'beastmaster': APEX_BEASTMASTER
  },
  'Warden': {
    'shadowblade': WARDEN_SHADOWBLADE,
    'jailer': WARDEN_JAILER,
    'avenger': WARDEN_VENGEANCE_SEEKER,
    'vengeance-seeker': WARDEN_VENGEANCE_SEEKER
  },
  'Berserker': {
    'primal_rage': BERSERKER_PRIMAL_RAGE,
    'blood_frenzy': BERSERKER_BLOOD_FRENZY,
    'savage_instincts': BERSERKER_SAVAGE_INSTINCTS
  },
  // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
  'Revenant': {
    'sanguine_harvest': REVENANT_SANGUINE_HARVEST,
    'frost_sovereign': REVENANT_FROST_SOVEREIGN,
    'phylactery_anchor': REVENANT_PHYLACTERY_ANCHOR
  },
  'Augur': {
    'auspex': AUGUR_AUSPICE,
    'harbinger': AUGUR_HARBINGER,
    'hierophant': AUGUR_HIEROPHANT
  },
};

// Helper function to get talents for a specific class and specialization
export const getTalentsForSpec = (className, specId) => {
  return TALENT_TREES[className]?.[specId] || PLACEHOLDER_TREE;
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
