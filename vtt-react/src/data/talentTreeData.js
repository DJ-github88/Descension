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
import {
  DREADNAUGHT_SHADOW_CITADEL,
  DREADNAUGHT_SUFFERING_WEAVER,
  DREADNAUGHT_DOOM_BRINGER
} from './talentTrees/dreadnaught.js';

import {
  TITAN_COLOSSAL_STRENGTH,
  TITAN_EARTH_DOMINION,
  TITAN_STRAIN_ENDURANCE
} from './talentTrees/titan.js';

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
  CHRONARCH_TEMPORAL_CONTROL,
  CHRONARCH_TIME_MANIPULATION,
  CHRONARCH_CHRONOS_ENERGY
} from './talentTrees/chronarch.js';

import {
  CHAOS_WEAVER_REALITY_BENDING,
  CHAOS_WEAVER_ENTROPY_CONTROL,
  CHAOS_WEAVER_CHAOS_DICE
} from './talentTrees/chaosweaver.js';

import {
  FATE_WEAVER_FORTUNE_TELLER,
  FATE_WEAVER_CARD_MASTER,
  FATE_WEAVER_THREAD_WEAVER
} from './talentTrees/fateweaver.js';

import {
  GAMBLER_LUCK_MANIPULATION,
  GAMBLER_RISK_MANAGEMENT,
  GAMBLER_FATE_CONTROL
} from './talentTrees/gambler.js';

import {
  MARTYR_PROTECTOR,
  MARTYR_REDEEMER,
  MARTYR_AVENGER
} from './talentTrees/martyr.js';

import {
  FALSE_PROPHET_VOIDCALLER,
  FALSE_PROPHET_DECEIVER,
  FALSE_PROPHET_CULTIST
} from './talentTrees/falseprophet.js';

import {
  EXORCIST_DEMONOLOGIST,
  EXORCIST_DEMON_LORD,
  EXORCIST_POSSESSED
} from './talentTrees/exorcist.js';

import {
  ORACLE_SEER,
  ORACLE_TRUTHSEEKER,
  ORACLE_DESTINY_WEAVER
} from './talentTrees/oracle.js';

import {
  PLAGUEBRINGER_VIRULENT_SPREADER,
  PLAGUEBRINGER_TORMENT_WEAVER,
  PLAGUEBRINGER_DECAY_HARBINGER
} from './talentTrees/plaguebringer.js';

import {
  LICHBORNE_FROSTBOUND_TYRANT,
  LICHBORNE_SPECTRAL_REAPER,
  LICHBORNE_PHYLACTERY_GUARDIAN
} from './talentTrees/lichborne.js';

import {
  SPELLGUARD_ARCANE_WARDEN,
  SPELLGUARD_SPELL_BREAKER,
  SPELLGUARD_MANA_REAVER
} from './talentTrees/spellguard.js';

import {
  INSCRIPTOR_RUNEBINDER,
  INSCRIPTOR_ENCHANTER,
  INSCRIPTOR_GLYPHWEAVER
} from './talentTrees/inscriptor.js';

import {
  ARCANONEER_PRISM_MAGE,
  ARCANONEER_ENTROPY_WEAVER,
  ARCANONEER_SPHERE_ARCHITECT
} from './talentTrees/arcanoneer.js';

import {
  FORMBENDER_METAMORPH,
  FORMBENDER_FORM_THIEF,
  FORMBENDER_PRIMORDIAL
} from './talentTrees/formbender.js';

import {
  WITCH_DOCTOR_SHADOW_PRIEST,
  WITCH_DOCTOR_SPIRIT_HEALER,
  WITCH_DOCTOR_WAR_PRIEST
} from './talentTrees/witchdoctor.js';

import {
  BERSERKER_PRIMAL_RAGE,
  BERSERKER_BLOOD_FRENZY,
  BERSERKER_SAVAGE_INSTINCTS
} from './talentTrees/berserker.js';

import {
  PRIMALIST_EARTHWARDEN,
  PRIMALIST_STORMBRINGER,
  PRIMALIST_SPIRITCALLER
} from './talentTrees/primalist.js';

import {
  DEATHCALLER_BLOOD_REAVER,
  DEATHCALLER_SPECTRAL_MASTER,
  DEATHCALLER_VOID_CALLER
} from './talentTrees/deathcaller.js';

import {
  COVENBANE_SHADOWBANE,
  COVENBANE_SPELLBREAKER,
  COVENBANE_DEMONHUNTER
} from './talentTrees/covenbane.js';

import {
  BLADEDANCER_FLOW_MASTER,
  BLADEDANCER_DUELIST,
  BLADEDANCER_SHADOW_DANCER
} from './talentTrees/bladedancer.js';

import {
  LUNARCH_MOONLIGHT_SENTINEL,
  LUNARCH_STARFALL_INVOKER,
  LUNARCH_MOONWELL_GUARDIAN
} from './talentTrees/lunarch.js';

import {
  HUNTRESS_SHADOWBLADE,
  HUNTRESS_SENTINEL,
  HUNTRESS_BEASTMASTER
} from './talentTrees/huntress.js';

import {
  WARDEN_SHADOWBLADE,
  WARDEN_JAILER,
  WARDEN_AVENGER
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
    'Dreadnaught': {
      'shadow_citadel': 'url(/assets/backdrops/dreadnaught-shadow-citadel.jpg)',
      'suffering_weaver': 'url(/assets/backdrops/dreadnaught-suffering-weaver.jpg)',
      'doom_bringer': 'url(/assets/backdrops/dreadnaught-doom-bringer.jpg)'
    },
    'Titan': {
      'colossal_strength': 'url(/assets/backdrops/titan-colossal-strength.jpg)',
      'earth_dominion': 'url(/assets/backdrops/titan-earth-dominion.jpg)',
      'strain_endurance': 'url(/assets/backdrops/titan-strain-endurance.jpg)'
    },
    'Toxicologist': {
      'venomancer': 'url(/assets/backdrops/toxicologist-venomancer.jpg)',
      'gadgeteer': 'url(/assets/backdrops/toxicologist-gadgeteer.jpg)',
      'saboteur': 'url(/assets/backdrops/toxicologist-saboteur.jpg)'
    },
    'Chaos Weaver': {
      'reality_bending': 'url(/assets/backdrops/chaos-reality.jpg)',
      'entropy_control': 'url(/assets/backdrops/chaos-entropy.jpg)',
      'chaos_dice': 'url(/assets/backdrops/chaos-dice.jpg)'
    },
    'Arcanoneer': {
      'prism_mage': 'url(/assets/backdrops/arcanoneer-prism.jpg)',
      'entropy_weaver': 'url(/assets/backdrops/arcanoneer-entropy.jpg)',
      'sphere_architect': 'url(/assets/backdrops/arcanoneer-sphere.jpg)'
    },
    'Formbender': {
      'metamorph': 'url(/assets/backdrops/formbender-metamorph.jpg)',
      'form-thief': 'url(/assets/backdrops/formbender-form-thief.jpg)',
      'primordial': 'url(/assets/backdrops/formbender-primordial.jpg)'
    },
    'Witch Doctor': {
      'shadow-priest': 'url(/assets/backdrops/witch-doctor-shadow.jpg)',
      'spirit-healer': 'url(/assets/backdrops/witch-doctor-spirit.jpg)',
      'war-priest': 'url(/assets/backdrops/witch-doctor-war.jpg)'
    },
    'Covenbane': {
      'shadowbane': 'url(/assets/backdrops/covenbane-shadowbane.jpg)',
      'spellbreaker': 'url(/assets/backdrops/covenbane-spellbreaker.jpg)',
      'demonhunter': 'url(/assets/backdrops/covenbane-demonhunter.jpg)'
    },
    'Bladedancer': {
      'flow-master': 'url(/assets/backdrops/bladedancer-flow-master.jpg)',
      'duelist': 'url(/assets/backdrops/bladedancer-duelist.jpg)',
      'shadow-dancer': 'url(/assets/backdrops/bladedancer-shadow-dancer.jpg)'
    },
    'Lunarch': {
      'moonlight-sentinel': 'url(/assets/backdrops/lunarch-moonlight-sentinel.jpg)',
      'starfall-invoker': 'url(/assets/backdrops/lunarch-starfall-invoker.jpg)',
      'moonwell-guardian': 'url(/assets/backdrops/lunarch-moonwell-guardian.jpg)'
    },
    'Huntress': {
      'shadowblade': 'url(/assets/backdrops/huntress-shadowblade.jpg)',
      'sentinel': 'url(/assets/backdrops/huntress-sentinel.jpg)',
      'beastmaster': 'url(/assets/backdrops/huntress-beastmaster.jpg)'
    },
    'Warden': {
      'shadowblade': 'url(/assets/backdrops/warden-shadowblade.jpg)',
      'jailer': 'url(/assets/backdrops/warden-jailer.jpg)',
      'avenger': 'url(/assets/backdrops/warden-avenger.jpg)'
    },
    'Fate Weaver': {
      'fortune_teller': 'url(/assets/backdrops/fate-fortune.jpg)',
      'card_master': 'url(/assets/backdrops/fate-cardmaster.jpg)',
      'thread_weaver': 'url(/assets/backdrops/fate-thread.jpg)'
    },
    'Gambler': {
      'luck_manipulation': 'url(/assets/backdrops/gambler-luck.jpg)',
      'risk_management': 'url(/assets/backdrops/gambler-risk.jpg)',
      'fate_control': 'url(/assets/backdrops/gambler-fate.jpg)'
    },
    'Martyr': {
      'protector': 'url(/assets/backdrops/martyr-protector.jpg)',
      'redeemer': 'url(/assets/backdrops/martyr-redeemer.jpg)',
      'avenger': 'url(/assets/backdrops/martyr-avenger.jpg)'
    },
    'False Prophet': {
      'voidcaller': 'url(/assets/backdrops/falseprophet-voidcaller.jpg)',
      'deceiver': 'url(/assets/backdrops/falseprophet-deceiver.jpg)',
      'cultist': 'url(/assets/backdrops/falseprophet-cultist.jpg)'
    },
    'Exorcist': {
      'demonologist': 'url(/assets/backdrops/exorcist-demonologist.jpg)',
      'demon_lord': 'url(/assets/backdrops/exorcist-demonlord.jpg)',
      'possessed': 'url(/assets/backdrops/exorcist-possessed.jpg)'
    },
    'Oracle': {
      'seer': 'url(/assets/backdrops/oracle-seer.jpg)',
      'truthseeker': 'url(/assets/backdrops/oracle-truthseeker.jpg)',
      'destiny_weaver': 'url(/assets/backdrops/oracle-destinyweaver.jpg)'
    },
    'Plaguebringer': {
      'virulent_spreader': 'url(/assets/backdrops/plaguebringer-virulent.jpg)',
      'torment_weaver': 'url(/assets/backdrops/plaguebringer-torment.jpg)',
      'decay_harbinger': 'url(/assets/backdrops/plaguebringer-decay.jpg)'
    },
    'Lichborne': {
      'frostbound_tyrant': 'url(/assets/backdrops/lichborne-frostbound.jpg)',
      'spectral_reaper': 'url(/assets/backdrops/lichborne-spectral.jpg)',
      'phylactery_guardian': 'url(/assets/backdrops/lichborne-phylactery.jpg)'
    },
    'Deathcaller': {
      'blood_reaver': 'url(/assets/backdrops/deathcaller-blood.jpg)',
      'spectral_master': 'url(/assets/backdrops/deathcaller-spectral.jpg)',
      'void_caller': 'url(/assets/backdrops/deathcaller-void.jpg)'
    },
    'Spellguard': {
      'arcane_warden': 'url(/assets/backdrops/spellguard-warden.jpg)',
      'spell_breaker': 'url(/assets/backdrops/spellguard-breaker.jpg)',
      'mana_reaver': 'url(/assets/backdrops/spellguard-reaver.jpg)'
    },
    'Inscriptor': {
      'runebinder': 'url(/assets/backdrops/inscriptor-runebinder.jpg)',
      'enchanter': 'url(/assets/backdrops/inscriptor-enchanter.jpg)',
      'glyphweaver': 'url(/assets/backdrops/inscriptor-glyphweaver.jpg)'
    },
    'Primalist': {
      'earthwarden': 'url(/assets/backdrops/primalist-earthwarden.jpg)',
      'stormbringer': 'url(/assets/backdrops/primalist-stormbringer.jpg)',
      'spiritcaller': 'url(/assets/backdrops/primalist-spiritcaller.jpg)'
    },
    'Berserker': {
      'primal_rage': 'url(/assets/backdrops/berserker-primal-rage.jpg)',
      'blood_frenzy': 'url(/assets/backdrops/berserker-blood-frenzy.jpg)',
      'savage_instincts': 'url(/assets/backdrops/berserker-savage-instincts.jpg)'
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
  'Dreadnaught': {
    'shadow_citadel': DREADNAUGHT_SHADOW_CITADEL,
    'suffering_weaver': DREADNAUGHT_SUFFERING_WEAVER,
    'doom_bringer': DREADNAUGHT_DOOM_BRINGER
  },
  'Titan': {
    'colossal_strength': TITAN_COLOSSAL_STRENGTH,
    'earth_dominion': TITAN_EARTH_DOMINION,
    'strain_endurance': TITAN_STRAIN_ENDURANCE
  },
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
    'stasis': CHRONARCH_TEMPORAL_CONTROL,
    'displacement': CHRONARCH_TIME_MANIPULATION,
    'rewinding': CHRONARCH_CHRONOS_ENERGY
  },
  'Chaos Weaver': {
    'reality_bending': CHAOS_WEAVER_REALITY_BENDING,
    'entropy_control': CHAOS_WEAVER_ENTROPY_CONTROL,
    'chaos_dice': CHAOS_WEAVER_CHAOS_DICE
  },
  'Fate Weaver': {
    'fortune_teller': FATE_WEAVER_FORTUNE_TELLER,
    'card_master': FATE_WEAVER_CARD_MASTER,
    'thread_weaver': FATE_WEAVER_THREAD_WEAVER
  },
  'Gambler': {
    'luck_manipulation': GAMBLER_LUCK_MANIPULATION,
    'risk_management': GAMBLER_RISK_MANAGEMENT,
    'fate_control': GAMBLER_FATE_CONTROL
  },
  'Martyr': {
    'protector': MARTYR_PROTECTOR,
    'redeemer': MARTYR_REDEEMER,
    'avenger': MARTYR_AVENGER
  },
  'False Prophet': {
    'voidcaller': FALSE_PROPHET_VOIDCALLER,
    'deceiver': FALSE_PROPHET_DECEIVER,
    'cultist': FALSE_PROPHET_CULTIST
  },
  'Exorcist': {
    'demonologist': EXORCIST_DEMONOLOGIST,
    'demon_lord': EXORCIST_DEMON_LORD,
    'possessed': EXORCIST_POSSESSED
  },
  'Oracle': {
    'seer': ORACLE_SEER,
    'truthseeker': ORACLE_TRUTHSEEKER,
    'destiny_weaver': ORACLE_DESTINY_WEAVER
  },
  'Plaguebringer': {
    'virulent_spreader': PLAGUEBRINGER_VIRULENT_SPREADER,
    'torment_weaver': PLAGUEBRINGER_TORMENT_WEAVER,
    'decay_harbinger': PLAGUEBRINGER_DECAY_HARBINGER
  },
  'Lichborne': {
    'frostbound_tyrant': LICHBORNE_FROSTBOUND_TYRANT,
    'spectral_reaper': LICHBORNE_SPECTRAL_REAPER,
    'phylactery_guardian': LICHBORNE_PHYLACTERY_GUARDIAN
  },
  'Spellguard': {
    'arcane_warden': SPELLGUARD_ARCANE_WARDEN,
    'spell_breaker': SPELLGUARD_SPELL_BREAKER,
    'mana_reaver': SPELLGUARD_MANA_REAVER
  },
  'Inscriptor': {
    'runebinder': INSCRIPTOR_RUNEBINDER,
    'enchanter': INSCRIPTOR_ENCHANTER,
    'glyphweaver': INSCRIPTOR_GLYPHWEAVER
  },
  'Arcanoneer': {
    'prism_mage': ARCANONEER_PRISM_MAGE,
    'entropy_weaver': ARCANONEER_ENTROPY_WEAVER,
    'sphere_architect': ARCANONEER_SPHERE_ARCHITECT
  },
  'Formbender': {
    'metamorph': FORMBENDER_METAMORPH,
    'form_thief': FORMBENDER_FORM_THIEF,
    'primordial': FORMBENDER_PRIMORDIAL
  },
  'Witch Doctor': {
    'shadow-priest': WITCH_DOCTOR_SHADOW_PRIEST,
    'spirit-healer': WITCH_DOCTOR_SPIRIT_HEALER,
    'war-priest': WITCH_DOCTOR_WAR_PRIEST
  },
  'Covenbane': {
    'shadowbane': COVENBANE_SHADOWBANE,
    'spellbreaker': COVENBANE_SPELLBREAKER,
    'demonhunter': COVENBANE_DEMONHUNTER
  },
  'Bladedancer': {
    'flow-master': BLADEDANCER_FLOW_MASTER,
    'duelist': BLADEDANCER_DUELIST,
    'shadow-dancer': BLADEDANCER_SHADOW_DANCER
  },
  'Lunarch': {
    'moonlight-sentinel': LUNARCH_MOONLIGHT_SENTINEL,
    'starfall-invoker': LUNARCH_STARFALL_INVOKER,
    'moonwell-guardian': LUNARCH_MOONWELL_GUARDIAN
  },
  'Huntress': {
    'shadowblade': HUNTRESS_SHADOWBLADE,
    'sentinel': HUNTRESS_SENTINEL,
    'beastmaster': HUNTRESS_BEASTMASTER
  },
  'Warden': {
    'shadowblade': WARDEN_SHADOWBLADE,
    'jailer': WARDEN_JAILER,
    'avenger': WARDEN_AVENGER
  },
  'Berserker': {
    'primal_rage': BERSERKER_PRIMAL_RAGE,
    'blood_frenzy': BERSERKER_BLOOD_FRENZY,
    'savage_instincts': BERSERKER_SAVAGE_INSTINCTS
  },
  'Primalist': {
    'earthwarden': PRIMALIST_EARTHWARDEN,
    'stormbringer': PRIMALIST_STORMBRINGER,
    'spiritcaller': PRIMALIST_SPIRITCALLER
  },
  'Deathcaller': {
    'blood_reaver': DEATHCALLER_BLOOD_REAVER,
    'spectral_master': DEATHCALLER_SPECTRAL_MASTER,
    'void_caller': DEATHCALLER_VOID_CALLER
  }
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
