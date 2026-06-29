// ============================================
// TALENT TREES INDEX - CENTRAL EXPORT
// ============================================

// Import all class talent trees
// 'Dreadnaught' talent trees removed (absorbed into Martyr as Ironclad specialization)

// Titan talent trees removed (absorbed into Warden as Monolith specialization)

export {
  TOXICOLOGIST_VENOMANCER,
  TOXICOLOGIST_GADGETEER,
  TOXICOLOGIST_SABOTEUR
} from './toxicologist.js';

export {
  PYROFIEND_INFERNO,
  PYROFIEND_WILDFIRE,
  PYROFIEND_HELLFIRE
} from './pyrofiend.js';

export {
  MINSTREL_HARMONIC_WEAVING,
  MINSTREL_CHORD_COMBINATIONS,
  MINSTREL_MUSICAL_MAGIC
} from './minstrel.js';

export {
  CHRONARCH_STASIS_TREE,
  CHRONARCH_DISPLACEMENT_TREE,
  CHRONARCH_REWINDING_TREE
} from './chronarch.js';

export {
  HARBINGER_WILD_PROPHET,
  HARBINGER_DEATHS_SEER,
  HARBINGER_FATE_RIFT
} from './harbinger.js';

export {
  GAMBIT_FORTUNE_TELLER,
  GAMBIT_CARD_MASTER,
  GAMBIT_THREAD_WEAVER
} from './gambit.js';

export {
  GAMBIT_LUCK_MANIPULATION,
  GAMBIT_RISK_MANAGEMENT,
  GAMBIT_FATE_CONTROL
} from './gambit.js';

export {
  MARTYR_REDEMPTION,
  MARTYR_ZEALOT,
  MARTYR_ASCETIC
} from './martyr.js';

export {
  FALSE_PROPHET_VOIDCALLER,
  FALSE_PROPHET_DECEIVER,
  FALSE_PROPHET_CULTIST
} from './falseprophet.js';

// Inquisitor talent trees (merged from Covenbane + Exorcist in Phase 1.9)
export {
  INQUISITOR_WITCH_HAMMER,
  INQUISITOR_IRON_VERDICT,
  INQUISITOR_HOLLOW_SAINT
} from './inquisitor.js';


export {
  PLAGUEBRINGER_VIRULENT_SPREADER,
  PLAGUEBRINGER_TORMENT_WEAVER,
  PLAGUEBRINGER_DECAY_HARBINGER
} from './plaguebringer.js';

// 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
export {
  REVENANT_SANGUINE_HARVEST,
  REVENANT_FROST_SOVEREIGN,
  REVENANT_PHYLACTERY_ANCHOR
} from './revenant.js';

export {
  SPELLGUARD_ARCANE_WARDEN,
  SPELLGUARD_SPELL_BREAKER,
  SPELLGUARD_MANA_REAVER
} from './spellguard.js';

export {
  INSCRIPTOR_RUNEBINDER,
  INSCRIPTOR_ENCHANTER,
  INSCRIPTOR_GLYPHWEAVER
} from './inscriptor.js';

export {
  ARCANONEER_PRISM_MAGE,
  ARCANONEER_ENTROPY_WEAVER,
  ARCANONEER_SPHERE_ARCHITECT
} from './arcanoneer.js';

export {
  WITCH_DOCTOR_BOKOR,
  WITCH_DOCTOR_MAMBO,
  WITCH_DOCTOR_HOUNGAN
} from './witchdoctor.js';

export {
  SHAPER_FLOW_MASTER,
  SHAPER_IRON_DANCER,
  SHAPER_PRIMAL_SHADOW
} from './shaper.js';

export {
  BERSERKER_PRIMAL_RAGE,
  BERSERKER_BLOOD_FRENZY,
  BERSERKER_SAVAGE_INSTINCTS
} from './berserker.js';

export {
  PRIMALIST_EARTHWARDEN,
  PRIMALIST_STORMBRINGER,
  PRIMALIST_SPIRITCALLER
} from './primalist.js';

export {
  AUGUR_AUSPICE,
  AUGUR_HARBINGER,
  AUGUR_HIEROPHANT
} from './augur.js';



// Re-export all existing talent trees from the main file
export {
  // TALENT_TREES object and helper functions
  TALENT_TREES,
  getTalentsForSpec,
  getTreeBackdrop,
  getFallbackBackground,
  PLACEHOLDER_TREE
} from '../talentTreeData.js';
